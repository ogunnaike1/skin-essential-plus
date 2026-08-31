import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import {
  formatNaira,
  getProductBySlug,
  getProductsWithSlugs,
  type ProductWithSlug,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

interface ProductPageProps {
  params: { slug: string };
}

/** Maps our stock_status column onto the schema.org availability vocabulary. */
const AVAILABILITY: Record<ProductWithSlug["stock_status"], string> = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "pre-order": "https://schema.org/PreOrder",
  "out-of-stock": "https://schema.org/OutOfStock",
};

const STOCK_LABEL: Record<ProductWithSlug["stock_status"], string> = {
  "in-stock": "In stock",
  "low-stock": "Low stock",
  "pre-order": "Available to pre-order",
  "out-of-stock": "Out of stock",
};

/**
 * Only the slugs returned by generateStaticParams exist. Anything else gets a
 * real HTTP 404 from the router.
 *
 * With the default (true), Next renders unknown slugs on demand and caches the
 * notFound() result as a static page, which answers HTTP 200 — a "soft 404"
 * that Google flags as a low-quality page.
 *
 * Trade-off: a service or product added to the database has no page until the
 * next deploy. Existing pages still refresh on their own via the fetch-level
 * revalidate in lib/catalog.ts.
 */
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const products = await getProductsWithSlugs();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return pageMetadata({
      title: "Product Not Found",
      description: "This product is no longer available.",
      path: "/shop",
    });
  }

  const detail = [product.description, product.tagline]
    .filter(Boolean)
    .join(" — ");
  const volume = product.volume ? `${product.volume}, ` : "";

  return pageMetadata({
    title: product.name,
    description:
      `${detail || product.name}. ${volume}${formatNaira(product.price)}. Buy from Skin Essential Plus, Ibadan — delivered nationwide.`.slice(
        0,
        160
      ),
    path: `/shop/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.ReactElement> {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await getProductsWithSlugs())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Product + Offer is what lets Google show price and "in stock" directly in
  // the search result. aggregateRating is included only when real reviews
  // exist — inventing one breaks Google's structured data policy.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.tagline || product.name,
    image: product.image_url,
    sku: product.id,
    category: product.category,
    ...(product.key_ingredient && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Key ingredient",
        value: product.key_ingredient,
      },
    }),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      price: product.price,
      priceCurrency: "NGN",
      availability: AVAILABILITY[product.stock_status],
      seller: { "@id": `${SITE_URL}/#business` },
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.review_count,
      },
    }),
  };

  const details: [string, string][] = [
    ["Volume", product.volume],
    ["Key ingredient", product.key_ingredient],
    ["Category", product.category],
    ["Availability", STOCK_LABEL[product.stock_status]],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <main className="min-h-screen bg-ivory">
      <JsonLd schema={schema} />

      <section className="section-padding pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-deep/50 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-deep">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-deep">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-deep">{product.name}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-glass">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div>
              {product.tagline && (
                <p className="text-sm uppercase tracking-widest text-mauve mb-3">
                  {product.tagline}
                </p>
              )}

              <h1 className="font-display text-4xl font-light text-deep mb-4">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-deep/70 font-light leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              <p className="text-3xl font-light text-deep mb-2">
                {formatNaira(product.price)}
                {product.original_price != null &&
                  product.original_price > product.price && (
                    <span className="ml-3 text-lg text-deep/40 line-through">
                      {formatNaira(product.original_price)}
                    </span>
                  )}
              </p>

              <p className="text-sm text-deep/60 mb-8">
                {STOCK_LABEL[product.stock_status]}
                {product.review_count > 0 && (
                  <>
                    {" "}
                    · ★ {product.rating} ({product.review_count} reviews)
                  </>
                )}
              </p>

              <dl className="divide-y divide-deep/10 border-y border-deep/10 mb-8">
                {details.map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 text-sm">
                    <dt className="text-deep/60">{label}</dt>
                    <dd className="text-deep capitalize">{value}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/shop"
                className="inline-block rounded-full bg-deep px-8 py-3 text-white transition-colors hover:bg-deep-dark"
              >
                Add to cart in the shop
              </Link>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-light text-deep mb-6">
                More in {product.category}
              </h2>
              <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-glass">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 text-sm text-deep">{item.name}</p>
                    <p className="text-sm text-deep/60">
                      {formatNaira(item.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
