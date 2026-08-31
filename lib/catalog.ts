/**
 * Server-side catalogue reads for the public service and product pages.
 *
 * These hit the REST endpoint rather than using the supabase-js client so the
 * responses go through Next's fetch cache and the pages can be statically
 * rendered and revalidated.
 *
 * Server components only — this reads the service-role key.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Rebuild catalogue pages at most once every 5 minutes. */
const REVALIDATE_SECONDS = 300;

export interface CatalogService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  original_price: number | null;
  duration: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  stock: number;
  stock_status: "in-stock" | "low-stock" | "pre-order" | "out-of-stock";
  rating: number;
  review_count: number;
  tagline: string;
  key_ingredient: string;
  volume: string;
}

async function query<T>(path: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    console.error(`Catalog query failed (${res.status}):`, path);
    return [];
  }
  return res.json();
}

/** URL-safe slug: "Laser Hair Removal" -> "laser-hair-removal". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Every active service. No row limit — there are more than 100. */
export async function getServices(): Promise<CatalogService[]> {
  return query<CatalogService>(
    "services?select=*&is_active=eq.true&order=display_order.asc"
  );
}

export async function getProducts(): Promise<CatalogProduct[]> {
  return query<CatalogProduct>("products?select=*&order=name.asc");
}

export interface ServiceCategory {
  /** Display name as stored in the database, e.g. "Laser Hair Removal". */
  name: string;
  slug: string;
  services: CatalogService[];
  minPrice: number;
  maxPrice: number;
}

/** Groups active services by their category column, sorted by size. */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const services = await getServices();
  const grouped = new Map<string, CatalogService[]>();

  for (const service of services) {
    if (!service.category) continue;
    const existing = grouped.get(service.category);
    if (existing) existing.push(service);
    else grouped.set(service.category, [service]);
  }

  return [...grouped.entries()]
    .map(([name, items]) => {
      const prices = items.map((i) => i.price).filter((p) => p > 0);
      return {
        name,
        slug: slugify(name),
        services: items,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
      };
    })
    .sort((a, b) => b.services.length - a.services.length);
}

export async function getServiceCategory(
  slug: string
): Promise<ServiceCategory | null> {
  const categories = await getServiceCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Products have no slug column, so URLs come from the name.
 *
 * Two pairs currently share a name ("OLAY Body Lotion", "Face Facts"), so the
 * loser of each clash gets an id fragment appended. Sorting by id first keeps
 * the assignment stable across builds — otherwise a product's URL could change
 * between deploys and break every link to it.
 */
export function buildProductSlugs(
  products: CatalogProduct[]
): Map<string, string> {
  const slugById = new Map<string, string>();
  const taken = new Set<string>();

  for (const product of [...products].sort((a, b) => a.id.localeCompare(b.id))) {
    const base = slugify(product.name) || "product";
    const slug = taken.has(base) ? `${base}-${product.id.slice(0, 6)}` : base;
    taken.add(slug);
    slugById.set(product.id, slug);
  }
  return slugById;
}

export interface ProductWithSlug extends CatalogProduct {
  slug: string;
}

export async function getProductsWithSlugs(): Promise<ProductWithSlug[]> {
  const products = await getProducts();
  const slugs = buildProductSlugs(products);
  return products.map((p) => ({ ...p, slug: slugs.get(p.id) ?? p.id }));
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithSlug | null> {
  const products = await getProductsWithSlugs();
  return products.find((p) => p.slug === slug) ?? null;
}
