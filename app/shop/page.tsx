import { pageMetadata } from "@/lib/seo";

import { ProductLinks } from "@/components/seo/CatalogLinks";
import { BestSellers } from "@/components/shop/BestSellers";
import { NewArrivals } from "@/components/shop/NewArrivals";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { ShopCTA } from "@/components/shop/ShopCTA";


export const metadata = pageMetadata({
  title: "Shop — Clinical Skincare & Tools",
  description:
    "The Skin Essential Plus boutique. Clinical skincare, precision tools and curated bundles — formulated in-house and shipped nationwide across Nigeria.",
  path: "/shop",
});

export default function ShopPage(): React.ReactElement {
  return (
    <>
      <main>
        <ProductsGrid />
         <BestSellers />
         <NewArrivals />
        <ProductLinks />
        <ShopCTA />
      </main>
    </>
  );
}