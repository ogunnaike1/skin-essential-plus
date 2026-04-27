import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/sections/Footer";
import {
  Cormorant_Garamond,
  Manrope,
  Playfair_Display,
} from "next/font/google";

import { SITE } from "@/lib/constants";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "luxury skincare",
    "spa therapy",
    "eyelash sketching",
    "beauty Lagos",
    "premium skincare",
    "facial treatments",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${manrope.variable}`}
    >
      <Navbar />
      <body className="min-h-screen overflow-x-hidden">{children}</body>
       <Footer />
    </html>
  );
}
