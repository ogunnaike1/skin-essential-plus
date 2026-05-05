import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Skin Essential Plus",
  description: "Terms and conditions for using Skin Essential Plus services.",
};

export default function TermsPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-ivory section-padding py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-light text-deep mb-4">Terms of Service</h1>
        <p className="text-sm text-deep/50 mb-12">Last updated: May 2025</p>

        <div className="space-y-8 text-deep/80 font-light leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Appointments & Bookings</h2>
            <p>
              By booking an appointment, you agree to arrive on time for your scheduled session.
              Late arrivals may result in a shortened treatment. We reserve the right to reassign
              your slot if you arrive more than 15 minutes late without notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Cancellation Policy</h2>
            <p>
              We require at least 24 hours notice for cancellations or rescheduling. Cancellations
              made less than 24 hours before your appointment may incur a cancellation fee of up to
              50% of the service cost.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Health & Safety</h2>
            <p>
              Please inform us of any allergies, skin conditions, or medical history that may affect
              your treatment. We reserve the right to decline or modify a service if we believe it
              poses a risk to your health or wellbeing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Products & Shop</h2>
            <p>
              All product sales are final unless an item arrives damaged or defective. Please inspect
              your order upon receipt and contact us within 48 hours if there is an issue.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Limitation of Liability</h2>
            <p>
              Skin Essential Plus is not liable for any adverse reactions resulting from undisclosed
              allergies or medical conditions. Our therapists follow industry best practices, but
              individual results may vary.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-light text-deep mb-3">Contact</h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <a href="mailto:hello@skinessentialplus.com" className="text-mauve hover:underline">
                hello@skinessentialplus.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
