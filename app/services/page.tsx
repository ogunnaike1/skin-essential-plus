import type { Metadata } from "next";

import { ServicesCTA } from "@/components/services/ServicesCTA";
import { ServicesGrid } from "@/components/services/ServicesGrid";
import { EidBanner } from "@/components/shared/EidBanner";

export const metadata: Metadata = {
  title: "Services — Rituals & Treatments",
  description:
    "Browse the full menu of Skin Essential Plus services — facials, massage, lash, brow, waxing, IV drips, teeth whitening, and more.",
};

export default function ServicesPage(): React.ReactElement {
  return (
    <>
      <main>
        <EidBanner variant="services" />
        <ServicesGrid />
        <ServicesCTA />
      </main>
    </>
  );
}