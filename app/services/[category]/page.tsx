import { Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, SITE_URL } from "@/lib/constants";
import {
  formatNaira,
  getServiceCategories,
  getServiceCategory,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: { category: string };
}

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

export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = await getServiceCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getServiceCategory(params.category);
  if (!category) return pageMetadata({
    title: "Service Not Found",
    description: "This treatment category is no longer available.",
    path: "/services",
  });

  const priced = category.minPrice > 0;
  const from = priced ? ` From ${formatNaira(category.minPrice)}.` : "";

  return pageMetadata({
    title: `${category.name} in Ibadan`,
    description:
      `${category.name} at Skin Essential Plus, Akobo, Ibadan — ${category.services.length} treatment options.${from} Book online, Mon–Sat 10am–6pm.`.slice(
        0,
        160
      ),
    path: `/services/${category.slug}`,
  });
}

export default async function ServiceCategoryPage({
  params,
}: CategoryPageProps): Promise<React.ReactElement> {
  const category = await getServiceCategory(params.category);
  if (!category) notFound();

  const others = (await getServiceCategories())
    .filter((c) => c.slug !== category.slug)
    .slice(0, 8);

  // An OfferCatalog lets Google read each treatment and its price as a distinct
  // offer from this business, rather than as undifferentiated page text.
  const schema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `${category.name} — ${SITE.name}`,
    url: `${SITE_URL}/services/${category.slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    itemListElement: category.services.map((service, index) => ({
      "@type": "Offer",
      position: index + 1,
      price: service.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        serviceType: category.name,
        areaServed: { "@type": "City", name: "Ibadan" },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-ivory">
      <JsonLd schema={schema} />

      <section className="section-padding pt-32 pb-12">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-deep/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-deep">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-deep">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-deep">{category.name}</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-light text-deep mb-4">
            {category.name} in Ibadan
          </h1>

          <p className="text-deep/70 font-light leading-relaxed max-w-2xl mb-6">
            {category.services.length} {category.name.toLowerCase()} treatment
            {category.services.length === 1 ? "" : "s"} at Skin Essential Plus in
            Akobo, Ibadan
            {category.minPrice > 0 && (
              <>
                , from {formatNaira(category.minPrice)} to{" "}
                {formatNaira(category.maxPrice)}
              </>
            )}
            . Every session is carried out in our studio by trained therapists.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-deep/60">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {SITE.address}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {SITE.hours}
            </span>
          </div>
        </div>
      </section>

      <section className="section-padding pb-20">
        <div className="max-w-5xl mx-auto">
          <ul className="grid gap-4 sm:grid-cols-2">
            {category.services.map((service) => (
              <li
                key={service.id}
                className="rounded-2xl border border-deep/10 bg-white p-5 shadow-glass"
              >
                <div className="flex gap-4">
                  {service.image_url && (
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      width={72}
                      height={72}
                      className="h-18 w-18 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-serif text-lg text-deep">
                      {service.name}
                    </h2>
                    <p className="mt-1 text-sm font-light text-deep/70">
                      {service.description}
                    </p>
                    <p className="mt-3 text-sm text-deep/60">
                      <span className="font-medium text-deep">
                        {formatNaira(service.price)}
                      </span>
                      {service.duration > 0 && <> · {service.duration} min</>}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-3xl bg-deep-tint p-8 text-center">
            <h2 className="font-display text-2xl font-light text-deep mb-3">
              Book your {category.name.toLowerCase()} session
            </h2>
            <p className="text-deep/70 font-light mb-6">
              Call {SITE.phone} or book online. {SITE.hours}.
            </p>
            <Link
              href="/services"
              className="inline-block rounded-full bg-deep px-8 py-3 text-white transition-colors hover:bg-deep-dark"
            >
              Book an appointment
            </Link>
          </div>

          {others.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-2xl font-light text-deep mb-5">
                Other treatments
              </h2>
              <div className="flex flex-wrap gap-3">
                {others.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/services/${other.slug}`}
                    className="rounded-full border border-deep/15 px-4 py-2 text-sm text-deep/80 transition-colors hover:border-deep hover:text-deep"
                  >
                    {other.name}
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
