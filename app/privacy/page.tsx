import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Skin Essential Plus",
  description: "How Skin Essential Plus collects, uses, and protects your personal information.",
};

export default function PrivacyPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-ivory section-padding py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-light text-deep mb-4">Privacy Policy</h1>
        <p className="text-sm text-deep/50 mb-12">Last updated: May 2025</p>

        <div className="prose prose-deep max-w-none space-y-8 text-deep/80 font-light leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Information We Collect</h2>
            <p>
              We collect information you provide directly, such as when you book an appointment, create
              an account, or contact us. This may include your name, email address, phone number, and
              any notes related to your treatment preferences.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">How We Use Your Information</h2>
            <p>
              Your information is used to schedule and manage appointments, send booking confirmations
              and reminders, improve our services, and communicate with you about promotions or updates
              (only with your consent).
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data. We do not
              sell, trade, or transfer your information to third parties without your consent, except
              where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time. To
              exercise these rights, please contact us at{" "}
              <a href="mailto:skinessentialsp@gmail.com" className="text-mauve hover:underline">
                skinessentialsp@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Contact</h2>
            <p>
              If you have questions about this policy, reach us at{" "}
              <a href="mailto:skinessentialsp@gmail.com" className="text-mauve hover:underline">
                skinessentialsp@gmail.com
              </a>{" "}
              or call <a href="tel:+2348148303684" className="text-mauve hover:underline">+234 814 830 3684</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
