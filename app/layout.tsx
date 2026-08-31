import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import Script from "next/script";

import { SITE, SITE_URL } from "@/lib/constants";
import { ConditionalLayout } from "@/components/shared/ConditionalLayout";
import { CartProvider } from "@/app/contexts/CartContext";
import { ServiceCartProvider } from "@/app/contexts/ServiceCartContext";

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
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "spa in Ibadan",
    "skincare clinic Ibadan",
    "facial treatment Ibadan",
    "massage Ibadan",
    "eyelash extensions Ibadan",
    "beauty salon Akobo Ibadan",
    "luxury skincare Nigeria",
  ],
  icons: {
    icon: "/images/skin-essential-transparent.png",
    apple: "/images/skin-essential-transparent.png",
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE_URL,
    siteName: SITE.name,
    locale: "en_NG",
    type: "website",
    images: [{ url: "/images/skin-essential-transparent.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/images/skin-essential-transparent.png"],
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
      <head>
        {/* Preconnect to image CDNs so DNS is resolved before hero image request */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
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
        
        {/* Payment SDKs — loaded globally so they're ready before any modal opens */}
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />

        {/* Loading Screen + Cart Provider - Wraps entire app */}
        <RootLayoutClient>
       
            <CartProvider>
              <ServiceCartProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
              </ServiceCartProvider>
            </CartProvider>
       
        </RootLayoutClient>
      </body>
    </html>
  );
}