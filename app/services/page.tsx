import { pageMetadata } from "@/lib/seo";

import { ServicesCTA } from "@/components/services/ServicesCTA";
import { ServicesGrid } from "@/components/services/ServicesGrid";

export const metadata = pageMetadata({
  title: "Services — Facials, Massage, Lashes & Body Rituals",
  description:
    "The full treatment menu at our Ibadan studio: facials, massage, lashes, brows, waxing, IV drips and teeth whitening. Book a session online.",
  path: "/services",
});

export default function ServicesPage(): React.ReactElement {
  return (
    <>
      <main>
        <ServicesGrid />
        <ServicesCTA />
      </main>
    </>
  );
}
