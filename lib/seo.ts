import type { Metadata } from "next";

import { SITE, SITE_URL } from "@/lib/constants";

/** Shared social-preview image. Relative — `metadataBase` resolves it. */
export const OG_IMAGE = "/images/skin-essential-transparent.png";

interface PageSeo {
  /** Page title. The root layout appends " · Skin Essential Plus". */
  title: string;
  /** Search-result snippet. Keep under ~160 characters or Google truncates it. */
  description: string;
  /** Route path, leading slash, no trailing slash (except "/"). */
  path: string;
  /** Use the title verbatim, without the site-name suffix. For the homepage. */
  absoluteTitle?: boolean;
}

/**
 * Builds the metadata for a public page: title, description, canonical URL, and
 * matching Open Graph / Twitter tags.
 *
 * Without this, every page inherits the homepage's Open Graph title and
 * description, so every link shared on WhatsApp or Instagram looks identical.
 *
 * Note: a page's `openGraph` REPLACES the root layout's rather than merging
 * with it, so the image has to be repeated here or the previews lose it.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageSeo): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_NG",
      type: "website",
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
