import { pageMetadata } from "@/lib/seo";
import { localBusinessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationMap } from "@/components/contact/LocationMap";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactCTA } from "@/components/contact/ContactCTA";

export const metadata = pageMetadata({
  title: "Contact & Visit Us in Akobo, Ibadan",
  description:
    "Find Skin Essential Plus at No 2 Alaafia Avenue, Akobo, Ibadan. Call, message or book an appointment — open Monday to Saturday, 10am to 6pm.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <JsonLd schema={localBusinessSchema} />
      <ContactHero />
      <ContactForm />
      <LocationMap />
      <ContactFAQ />
      <ContactCTA />
    </main>
  );
}