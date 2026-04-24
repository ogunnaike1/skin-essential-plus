import type { Metadata } from "next";

import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/sections/Footer";
import { BestSellers } from "@/components/shop/BestSellers";
import { BrandStory } from "@/components/shop/BrandStory";
import { FeaturedCollections } from "@/components/shop/FeaturedCollections";
import { NewArrivals } from "@/components/shop/NewArrivals";
import { ProductsGrid } from "@/components/shop/ProductsGrid";
import { RoutineBundles } from "@/components/shop/RoutineBundles";
import { ShopCTA } from "@/components/shop/ShopCTA";
import { ShopHero } from "@/components/shop/ShopHero";

export const metadata: Metadata = {
  title: "Shop — Clinical Skincare & Tools",
  description:
    "The Skin Essential Plus boutique. Clinical skincare, precision tools, curated bundles — formulated in-house, shipped nationwide.",
};

export default function ShopPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main>
        <ShopHero />
        <FeaturedCollections />
        <BestSellers />
        <ProductsGrid />
        <NewArrivals />
        <RoutineBundles />
        <BrandStory />
        <ShopCTA />
      </main>
      <Footer />
    </>
  );
}