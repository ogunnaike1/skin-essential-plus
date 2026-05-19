import type { Metadata } from "next";

import { ServiceCartProvider } from "@/app/contexts/ServiceCartContext";
import { ServicesCTA } from "@/components/services/ServicesCTA";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export const metadata: Metadata = {
  title: "Services — Rituals & Treatments",
  description:
    "Browse the full menu of Skin Essential Plus services — facials, massage, lash, brow, waxing, IV drips, teeth whitening, and more.",
};

export default function ServicesPage(): React.ReactElement {
  return (
    <ServiceCartProvider>
      <main>
        <ServicesGrid />
        <ServicesCTA />
      </main>
    </ServiceCartProvider>
  );
}