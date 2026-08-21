"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface SubscribeFormProps {
  /** Recorded against the subscriber so we can see which page won them. */
  source?: string;
}

export function SubscribeForm({
  source = "newsletter_page",
}: SubscribeFormProps): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to subscribe");

      setStatus("success");
      setMessage(data.message ?? "You're subscribed.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Newsletter signup" className="max-w-lg">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={status === "loading"}
          className="flex-1 h-12 px-5 rounded-full bg-white border border-deep-tint text-sm font-light text-deep placeholder:text-deep-light focus:outline-none focus:border-mauve transition-colors duration-300 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex items-center justify-center h-12 px-7 bg-deep text-ivory rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:bg-deep-dark disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              <span className="ml-2">Subscribing</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-500 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      {status === "success" && (
        <p className="mt-4 flex items-start gap-2 text-sm text-forest font-light">
          <Check className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2.5} />
          {message}
        </p>
      )}

      {status === "error" && (
        <p className="mt-4 flex items-start gap-2 text-sm text-red-600 font-light">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {message}
        </p>
      )}

      <p className="mt-4 text-xs text-deep-light font-light">
        Two emails a month. Unsubscribe any time — one click, no questions.
      </p>
    </form>
  );
}
