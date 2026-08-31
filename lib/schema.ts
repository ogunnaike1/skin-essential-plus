import { SITE, SITE_URL } from "@/lib/constants";
import { OG_IMAGE } from "@/lib/seo";

/** Stable @id so every schema block refers to the same business entity. */
const BUSINESS_ID = `${SITE_URL}/#business`;

/** Taken from the marker on the OpenStreetMap embed in components/contact/LocationMap.tsx. */
const GEO = { latitude: 7.4277, longitude: 3.9393 };

/**
 * Tells Google this is a real salon at a real address with real opening hours —
 * the data behind map results and the "open now" badge for local searches.
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["BeautySalon", "DaySpa"],
  "@id": BUSINESS_ID,
  name: SITE.name,
  description: SITE.description,
  url: SITE_URL,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE_URL}${OG_IMAGE}`,
  logo: `${SITE_URL}${OG_IMAGE}`,
  priceRange: "₦₦",
  currenciesAccepted: "NGN",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No 2, Alaafia Avenue, Opposite IDC Primary School, Akobo",
    addressLocality: "Ibadan",
    addressRegion: "Oyo State",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: GEO.latitude,
    longitude: GEO.longitude,
  },
  hasMap: "https://maps.google.com/?q=No+2+Alaafia+Avenue+Akobo+Ibadan+Nigeria",
  areaServed: [
    { "@type": "City", name: "Ibadan" },
    { "@type": "AdministrativeArea", name: "Oyo State" },
  ],
  // Mon–Sat, 10:00–18:00. Sunday is deliberately absent: omitting a day means
  // closed, which is what powers the "Open now" / "Closed" badge in results.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "18:00",
    },
  ],
} as const;

/** Names the site itself, so Google can show a proper sitelinks brand entry. */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en-NG",
  publisher: { "@id": BUSINESS_ID },
} as const;
