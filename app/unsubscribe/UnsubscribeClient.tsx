"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, AlertCircle, Mail } from "lucide-react";

type State = "working" | "done" | "invalid";

export function UnsubscribeClient({
  token,
}: {
  token: string | null;
}): React.ReactElement {
  const [state, setState] = useState<State>(token ? "working" : "invalid");

  useEffect(() => {
    if (!token) return;

    void fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
      method: "POST",
    })
      .then(() => setState("done"))
      .catch(() => setState("done"));
  }, [token]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center section-padding py-24">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-ivory border border-white shadow-glow mb-8">
          {state === "invalid" ? (
            <AlertCircle className="h-5 w-5 text-deep" strokeWidth={1.5} />
          ) : state === "done" ? (
            <Check className="h-5 w-5 text-deep" strokeWidth={1.5} />
          ) : (
            <Mail className="h-5 w-5 text-deep" strokeWidth={1.5} />
          )}
        </div>

        {state === "working" && (
          <>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight">
              One moment…
            </h1>
            <p className="mt-4 text-base text-deep font-light">
              We're updating your preferences.
            </p>
          </>
        )}

        {state === "done" && (
          <>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight text-balance">
              You've been unsubscribed.
            </h1>
            <p className="mt-4 text-base text-deep font-light text-balance">
              You won't receive any more newsletters from us. No hard feelings —
              your inbox is yours.
            </p>
            <p className="mt-2 text-sm text-deep font-light opacity-70">
              Changed your mind? You're always welcome back.
            </p>
          </>
        )}

        {state === "invalid" && (
          <>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight text-balance">
              This link looks incomplete.
            </h1>
            <p className="mt-4 text-base text-deep font-light text-balance">
              We couldn't tell which subscription to update. Please use the
              unsubscribe link at the bottom of one of our emails, or contact us
              and we'll take care of it for you.
            </p>
          </>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-6 bg-deep text-ivory rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:bg-deep-dark"
          >
            Return home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-6 border border-deep/20 text-deep rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:border-deep/40"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
