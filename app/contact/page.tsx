import type { Metadata } from "next";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationMap } from "@/components/contact/LocationMap";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactCTA } from "@/components/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contact Us — Skin Essential Plus",
  description:
    "Get in touch with Skin Essential Plus. Book appointments, ask questions, or visit our Lekki spa. We're here to help with all your skincare needs.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactForm />
      <LocationMap />
      <ContactFAQ />
      <ContactCTA />
    </main>
  );
}