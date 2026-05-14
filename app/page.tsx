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

export default function HomePage(): React.ReactElement {
  return (
    <>
      
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
