import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — Skin Essential Plus",
  description: "How Skin Essential Plus uses cookies and similar technologies.",
};

export default function CookiesPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-ivory section-padding py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-light text-deep mb-4">Cookie Policy</h1>
        <p className="text-sm text-deep/50 mb-12">Last updated: May 2025</p>

        <div className="space-y-8 text-deep/80 font-light leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They
              help us remember your preferences and improve your experience on future visits.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-deep/70">
              <li>
                <strong className="font-medium text-deep">Essential cookies</strong> — required for
                the site to function (e.g., keeping you logged in, remembering cart items).
              </li>
              <li>
                <strong className="font-medium text-deep">Analytics cookies</strong> — help us
                understand how visitors use our site so we can improve it.
              </li>
              <li>
                <strong className="font-medium text-deep">Preference cookies</strong> — remember
                your settings and personalisation choices.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Managing Cookies</h2>
            <p>
              You can control or delete cookies through your browser settings. Disabling essential
              cookies may affect the functionality of our website. Most browsers allow you to refuse
              cookies or delete existing ones — refer to your browser&apos;s help documentation for
              instructions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Third-Party Cookies</h2>
            <p>
              Some pages may include content from third-party services (such as embedded maps or
              payment processors) that may set their own cookies. We have no control over these
              cookies and recommend reviewing those third parties&apos; cookie policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Contact</h2>
            <p>
              Questions about cookies? Email us at{" "}
              <a href="mailto:skinessentialsp@gmail.com" className="text-mauve hover:underline">
                skinessentialsp@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
