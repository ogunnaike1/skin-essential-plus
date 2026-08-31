import Script from "next/script";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set, so local and
 * preview builds send no traffic and the site ships no tracking until the
 * variable is deliberately added.
 *
 * `afterInteractive` keeps the script off the critical path — analytics should
 * never delay the page for a visitor.
 */
export function GoogleAnalytics(): React.ReactElement | null {
  if (!MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
