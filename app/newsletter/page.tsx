import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Letters from the Sanctuary — Our Newsletter",
  description:
    "The Skin Essential Plus welcome sequence: three emails over five days, sent from an authenticated domain with consent and opt-out handled from the first message.",
};

interface Email {
  day: string;
  role: string;
  subject: string;
  preview: string;
  body: string[];
}

const SEQUENCE: Email[] = [
  {
    day: "Day 0",
    role: "On signup",
    subject: "Welcome — here's your 10% off ✨",
    preview: "Plus what to expect from us (we keep it rare and worth it)",
    body: [
      "Thank you for joining us. Skin Essential Plus started in Lagos with one belief: good skin isn't about more products — it's about the right ones, used consistently.",
      "As promised, here's 10% off your first order with the code WELCOME10.",
      "We send two emails a month, sometimes fewer. Seasonal rituals, honest ingredient explainers, and early access when something new drops. No daily noise.",
      "If you ever have a skin question, just reply — I read them personally.",
    ],
  },
  {
    day: "Day 2",
    role: "Trust",
    subject: "Why I started Skin Essential Plus",
    preview: "It began with a problem I couldn't solve in Lagos",
    body: [
      "Finding skincare in Lagos that suits our climate and our skin is harder than it should be. Shelves full of products formulated for other weather, other concerns — and counterfeit versions of the good ones.",
      "So Skin Essential Plus became the thing I wished existed: a small, carefully chosen range, honest about what each product does and who it's for. No miracle claims. No twelve-step routines you'll abandon by Thursday.",
      "Consistency beats intensity. Three products used daily will outperform ten used occasionally, every time.",
      "Not sure where to start? Reply and tell me about your skin. I'll point you to the right two or three products — not the most expensive ones.",
    ],
  },
  {
    day: "Day 5",
    role: "Convert",
    subject: "The 3 products I'd start you on",
    preview: "A complete routine, under ₦40,000 — and your code expires Sunday",
    body: [
      "If you asked me in person where to begin, I wouldn't hand you ten products. I'd give you three.",
      "Cleanse with the Face Soap (₦12,000). Treat with the Face Serum (₦15,000) — the step that changes tone over time. Protect with the Face Cream (₦10,000), which seals everything in.",
      "That's ₦37,000 for a complete routine — ₦33,300 with your code.",
      "Use them in that order, twice a day, for eight weeks. Consistency is genuinely the whole secret.",
    ],
  },
];

const FLOW = [
  { title: "Subscriber", detail: "Enters their email on the site" },
  { title: "Our database", detail: "Saved first, with consent IP and timestamp" },
  { title: "Mailing list", detail: "Synced, with retry if the sync fails" },
  { title: "Sequence starts", detail: "Welcome email sends immediately" },
];

const FOUNDATION = [
  {
    title: "Domain authentication",
    detail:
      "DKIM signing on two rotating keys, plus a single valid DMARC policy — so providers can prove each message genuinely came from us.",
  },
  {
    title: "Branded sending",
    detail:
      "Links and images carry our own subdomain rather than the provider's, keeping marketing reputation separate from order emails.",
  },
  {
    title: "Consent on record",
    detail:
      "Every subscriber is stored with the timestamp and IP address of their opt-in — evidence of consent if it is ever questioned.",
  },
  {
    title: "One-click unsubscribe",
    detail:
      "Native opt-out in Gmail and Outlook via List-Unsubscribe headers, mirrored across both systems so nobody is emailed twice.",
  },
  {
    title: "List ownership",
    detail:
      "Subscribers live in our own database first and the email platform second, so the list is never locked to one vendor.",
  },
  {
    title: "Attribution",
    detail:
      "Every link is tagged per email, so visits and sales can be traced to the exact message that produced them.",
  },
];

const ASSURANCES = [
  "DKIM & DMARC authenticated",
  "Sends from hello@skinessentialplus.com",
  "One-click unsubscribe",
];

export default function NewsletterPage(): React.ReactElement {
  return (
    <main className="bg-ivory">
      {/* Hero */}
      <section className="section-padding pt-32 pb-16 sm:pt-40">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-mauve font-medium">
            Skin Essential Plus · Lagos
          </p>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-light text-deep leading-[1.02] tracking-tight text-balance">
            Letters from the sanctuary
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-lg text-deep font-light text-balance">
            A three-part welcome sequence for everyone who subscribes — built on
            an authenticated sending domain, with consent and opt-out handled
            properly from the first email.
          </p>

          {/* Inbox preview */}
          <div className="mt-12 rounded-2xl bg-white border border-deep-tint shadow-glass overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-deep-tint/40 border-b border-deep-tint">
              <span className="h-2 w-2 rounded-full bg-deep-wash" />
              <span className="h-2 w-2 rounded-full bg-deep-wash" />
              <span className="h-2 w-2 rounded-full bg-deep-wash" />
              <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-deep-light">
                Inbox
              </span>
            </div>

            <div className="flex gap-4 p-5 sm:p-6">
              <div className="shrink-0 h-10 w-10 rounded-full bg-mauve-tint text-mauve grid place-items-center font-display text-sm">
                SP
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-deep-dark truncate">
                    Skin Essential Plus
                  </p>
                  <span className="text-xs text-deep-light tabular-nums shrink-0">
                    09:41
                  </span>
                </div>
                <p className="mt-1 text-[15px] text-deep-dark font-medium">
                  Welcome — here&rsquo;s your 10% off ✨
                </p>
                <p className="mt-0.5 text-[13px] text-deep-light">
                  Plus what to expect from us (we keep it rare and worth it)
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2">
            {ASSURANCES.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[13px] text-deep-light font-light"
              >
                <Check className="h-3.5 w-3.5 text-forest" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The sequence */}
      <section className="section-padding py-20 border-t border-deep-tint">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-mauve font-medium">
            The sequence
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight">
            Three emails, five days
          </h2>
          <p className="mt-4 max-w-2xl text-base text-deep font-light text-balance">
            Each one has a single job. The first delivers what was promised, the
            second earns trust, and only the third asks for a sale.
          </p>

          <div className="mt-12 flex flex-col gap-7">
            {SEQUENCE.map((email) => (
              <article
                key={email.day}
                className="grid gap-4 sm:grid-cols-[110px_1fr] sm:gap-8"
              >
                <div className="flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1 sm:pt-6">
                  <span className="font-display text-3xl font-light text-mauve leading-none">
                    {email.day}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-deep-light">
                    {email.role}
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-deep-tint shadow-glass overflow-hidden">
                  <div className="px-6 py-5 border-b border-deep-tint">
                    <p className="font-display text-2xl font-light text-deep leading-snug">
                      {email.subject}
                    </p>
                    <p className="mt-1.5 text-[13px] text-deep-light">
                      {email.preview}
                    </p>
                  </div>
                  <div className="px-6 py-6 flex flex-col gap-4">
                    {email.body.map((para) => (
                      <p
                        key={para}
                        className="text-[15px] text-deep font-light leading-relaxed"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="section-padding py-20 border-t border-deep-tint">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-mauve font-medium">
            What happens on signup
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight">
            From form to inbox
          </h2>

          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((node) => (
              <li
                key={node.title}
                className="rounded-xl bg-white border border-deep-tint p-5"
              >
                <p className="text-sm font-semibold text-deep-dark">
                  {node.title}
                </p>
                <p className="mt-1.5 text-[13px] text-deep-light font-light">
                  {node.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Foundation */}
      <section className="section-padding py-20 border-t border-deep-tint">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.22em] text-mauve font-medium">
            The foundation
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-light text-deep leading-tight tracking-tight">
            Built to reach the inbox
          </h2>
          <p className="mt-4 max-w-2xl text-base text-deep font-light text-balance">
            Most newsletters land in spam because the sending domain was never
            authenticated. Ours was, before a single email went out.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOUNDATION.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white border border-deep-tint p-6"
              >
                <p className="text-sm font-semibold text-deep-dark">
                  {item.title}
                </p>
                <p className="mt-2 text-[13px] text-deep-light font-light leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/#newsletter"
              className="inline-flex items-center justify-center h-12 px-8 bg-deep text-ivory rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:bg-deep-dark"
            >
              Subscribe to the letters
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
