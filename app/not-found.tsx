import Link from "next/link";

import { pageMetadata } from "@/lib/seo";

/**
 * Without this file the root app/error.tsx boundary catches the notFound()
 * signal and renders it as a normal page, so missing URLs answer HTTP 200.
 * Google treats those "soft 404s" as low-quality pages. This boundary makes
 * them answer a real 404.
 */
export const metadata = pageMetadata({
  title: "Page Not Found",
  description: "This page does not exist. Browse our treatments and skincare.",
  path: "/",
});

export default function NotFound(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-light text-deep/30 mb-4">404</p>

        <h1 className="font-display text-2xl font-light text-deep mb-3">
          We couldn&apos;t find that page
        </h1>

        <p className="text-sage text-sm mb-8 leading-relaxed">
          The page may have moved, or the treatment or product is no longer
          listed. Everything we currently offer is below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/services"
            className="px-6 py-3 bg-deep text-ivory rounded-full text-sm font-medium hover:bg-deep/90 transition-colors"
          >
            Browse treatments
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-deep/20 text-deep rounded-full text-sm font-medium hover:bg-deep/5 transition-colors"
          >
            Visit the shop
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-deep/20 text-deep rounded-full text-sm font-medium hover:bg-deep/5 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
