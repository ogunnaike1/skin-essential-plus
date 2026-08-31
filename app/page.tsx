import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";

import { HeroCarousel } from "@/components/hero/HeroCarousel";

import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { Contact } from "@/components/sections/Contact";

import { Instagram } from "@/components/sections/Instagram";
import { Newsletter } from "@/components/sections/Newsletter";
import { Services } from "@/components/sections/Services";
import { ShopCTA } from "@/components/sections/ShopCTA";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FounderLetter } from "@/components/about/FounderLetter";
import { EidBanner } from "@/components/shared/EidBanner";

export const metadata = pageMetadata({
  // Absolute, so the site name is not appended twice on the homepage.
  title: `Luxury Skincare & Spa in Ibadan | ${SITE.name}`,
  absoluteTitle: true,
  description:
    "Premium skincare, spa therapy and beauty rituals in Akobo, Ibadan. Facials, massage, lashes, brows and clinical skincare — book your ritual today.",
  path: "/",
});

export default function HomePage(): React.ReactElement {
  return (
    <>
      <JsonLd schema={localBusinessSchema} />
      <JsonLd schema={websiteSchema} />

      <main>
        <HeroCarousel />
        <Services />
        <ShopCTA />
        <WhyChooseUs />
        <About />
        <BeforeAfter />
        <FounderLetter />
        <Testimonials />
        <BookingCTA />
        <Instagram />
        <Contact />
        <Newsletter />
      </main>
     
    </>
  );
}
