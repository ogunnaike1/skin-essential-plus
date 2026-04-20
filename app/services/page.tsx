import type { Metadata } from "next";

import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ServicesCTA } from "@/components/services/ServicesCTA";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { ServicesHero } from "@/components/services/ServicesHero";

export const metadata: Metadata = {
  title: "Services — Rituals & Treatments",
  description:
    "Browse the full menu of Skin Essential Plus services — facials, massage, lash, brow, waxing, IV drips, teeth whitening, and more.",
};

export default function ServicesPage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main>
        <ServicesHero />
        <ServicesGrid />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  );
}