"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-mauve/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-mauve"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-light text-deep mb-3">
          Something went wrong
        </h2>
        <p className="text-sage text-sm mb-8 leading-relaxed">
          We&apos;re having a brief hiccup. Please try again — your data is
          safe.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-deep text-ivory rounded-full text-sm font-medium hover:bg-deep/90 transition-colors"
          >
            Try again
          </button>
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
