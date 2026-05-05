import type { Metadata } from "next";

import { BestSellers } from "@/components/shop/BestSellers";
import { BrandStory } from "@/components/shop/BrandStory";
import { NewArrivals } from "@/components/shop/NewArrivals";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { ShopCTA } from "@/components/shop/ShopCTA";


export const metadata: Metadata = {
  title: "Shop — Clinical Skincare & Tools",
  description:
    "The Skin Essential Plus boutique. Clinical skincare, precision tools, curated bundles — formulated in-house, shipped nationwide.",
};

export default function ShopPage(): React.ReactElement {
  return (
    <>
      <main>
        <ProductsGrid />
         <BestSellers />
         <NewArrivals />
        <BrandStory />
        <ShopCTA />
      </main>
    </>
  );
}