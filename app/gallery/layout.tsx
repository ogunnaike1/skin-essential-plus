import { pageMetadata } from "@/lib/seo";

/**
 * `app/gallery/page.tsx` is a client component, and client components cannot
 * export `metadata`. This layout carries the gallery's SEO tags instead.
 */
export const metadata = pageMetadata({
  title: "Gallery — Our Work & Client Results",
  description:
    "Real results from the Skin Essential Plus studio in Ibadan — facials, lashes, brows, nails and body treatments, photographed in our own space.",
  path: "/gallery",
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
