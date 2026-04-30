'use client';

import Link from 'next/link';

export function GalleryCTA() {
  return (
    <section className="py-20 bg-mauve/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-deep mb-6">
            Ready for Your Transformation?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a consultation and let us create a personalized treatment plan for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="px-8 py-4 bg-mauve text-white rounded-full hover:bg-mauve-dark transition-colors text-lg font-medium inline-block"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 bg-white text-deep border-2 border-deep rounded-full hover:bg-deep hover:text-white transition-all text-lg font-medium inline-block"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}