import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import Script from "next/script";

import { SITE } from "@/lib/constants";
import { ConditionalLayout } from "@/components/shared/ConditionalLayout";
import { CartProvider } from "@/app/contexts/CartContext";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";

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
  icons: {
    icon: "/images/skin-essential-transparent.png",
    apple: "/images/skin-essential-transparent.png",
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
    images: [{ url: "/images/skin-essential-transparent.png" }],
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
      <body className="min-h-screen overflow-x-hidden">
        {/* Suppress hydration warnings from browser extensions */}
        <Script
          id="suppress-hydration-warnings"
          strategy="beforeInteractive"
        >{`
          if (typeof window !== 'undefined') {
            const originalError = console.error;
            console.error = (...args) => {
              if (typeof args[0] === 'string' && args[0].includes('cz-shortcut-listen')) {
                return;
              }
              originalError.apply(console, args);
            };
          }
        `}</Script>
        
        {/* Loading Screen + Cart Provider - Wraps entire app */}
        <RootLayoutClient>
          <CartProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </RootLayoutClient>
      </body>
    </html>
  );
}