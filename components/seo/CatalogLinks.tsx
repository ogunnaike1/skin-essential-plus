import Link from "next/link";

import { formatNaira, getProductsWithSlugs, getServiceCategories } from "@/lib/catalog";

/**
 * Server-rendered link blocks for the /services and /shop listing pages.
 *
 * The grids above them are client components that fetch after hydration, so
 * their links do not exist in the initial HTML. These blocks give crawlers a
 * plain path into every category and product page.
 */

export async function ServiceCategoryLinks(): Promise<React.ReactElement | null> {
  const categories = await getServiceCategories();
  if (categories.length === 0) return null;

  return (
    <section className="section-padding py-16 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-light text-deep mb-3">
          Browse treatments by type
        </h2>
        <p className="text-deep/60 font-light mb-8">
          Every treatment we offer in Akobo, Ibadan, grouped by category.
        </p>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="block rounded-2xl border border-deep/10 bg-white p-5 transition-colors hover:border-deep/30"
              >
                <span className="block font-serif text-lg text-deep">
                  {category.name}
                </span>
                <span className="mt-1 block text-sm text-deep/60">
                  {category.services.length} treatment
                  {category.services.length === 1 ? "" : "s"}
                  {category.minPrice > 0 && (
                    <> · from {formatNaira(category.minPrice)}</>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function ProductLinks(): Promise<React.ReactElement | null> {
  const products = await getProductsWithSlugs();
  if (products.length === 0) return null;

  return (
    <section className="section-padding py-16 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-light text-deep mb-3">
          All products
        </h2>
        <p className="text-deep/60 font-light mb-8">
          Every product in the Skin Essential Plus boutique.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/shop/${product.slug}`}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-deep/10 bg-white px-4 py-3 transition-colors hover:border-deep/30"
              >
                <span className="text-sm text-deep">{product.name}</span>
                <span className="shrink-0 text-sm text-deep/60">
                  {formatNaira(product.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
