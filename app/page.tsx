import { HeroCarousel } from "@/components/hero/HeroCarousel";
import { Navbar } from "@/components/navbar/Navbar";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Instagram } from "@/components/sections/Instagram";
import { Newsletter } from "@/components/sections/Newsletter";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function HomePage(): React.ReactElement {
  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <Services />
        <WhyChooseUs />
        <About />
        <BeforeAfter />
        <Testimonials />
        <BookingCTA />
        <Instagram />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
