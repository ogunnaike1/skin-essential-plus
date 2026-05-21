"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF9F7",
          fontFamily: "system-ui, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 300,
              color: "#354F52",
              marginBottom: "0.75rem",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "#47676A",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            We&apos;re having a brief hiccup. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#354F52",
              color: "#FAF9F7",
              border: "none",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
