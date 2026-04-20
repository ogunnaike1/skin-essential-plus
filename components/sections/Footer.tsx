"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/lib/constants";

const SERVICES_LINKS = [
  { label: "Skin Treatments", href: "#services" },
  { label: "Spa Therapy", href: "#services" },
  { label: "Eyelash Sketching", href: "#services" },
  { label: "Full Skincare", href: "#services" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "YouTube", href: "#", icon: Youtube },
] as const;

export function Footer(): React.ReactElement {
  return (
    <footer className="relative bg-gradient-deep text-ivory overflow-hidden">
      <div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C0A9BD 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #94A7AE 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="noise-overlay" />

      <div className="relative section-padding pt-20 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-ivory/15">
            {/* Brand column */}
            <div className="md:col-span-5">
              <Logo variant="light" size="lg" />
              <p className="mt-6 text-sm text-ivory/70 font-light leading-relaxed max-w-sm">
                {SITE.description}
              </p>
              <div className="mt-8 flex items-center gap-3">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="group h-10 w-10 rounded-full border border-ivory/20 flex items-center justify-center transition-all duration-500 hover:bg-ivory hover:border-ivory hover:scale-110"
                    >
                      <Icon
                        className="h-4 w-4 text-ivory group-hover:text-deep transition-colors duration-500"
                        strokeWidth={1.5}
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links columns */}
            <div className="md:col-span-2">
              <h4 className="eyebrow text-mauve mb-5">Explore</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-ivory/70 hover:text-ivory transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="eyebrow text-mauve mb-5">Services</h4>
              <ul className="space-y-3">
                {SERVICES_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-ivory/70 hover:text-ivory transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="eyebrow text-mauve mb-5">Contact</h4>
              <ul className="space-y-3 text-sm font-light text-ivory/70">
                <li>{SITE.address}</li>
                <li>
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="hover:text-ivory transition-colors"
                  >
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:text-ivory transition-colors"
                  >
                    {SITE.email}
                  </a>
                </li>
                <li className="pt-2 text-ivory/50 text-xs">{SITE.hours}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ivory/50 font-light">
              © {new Date().getFullYear()} {SITE.name}. Crafted with intention.
            </p>
            <ul className="flex items-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-ivory/50 hover:text-ivory font-light tracking-wide transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
