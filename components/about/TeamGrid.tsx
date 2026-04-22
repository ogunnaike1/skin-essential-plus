"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  cardBg: string;          // card background class
  nameColor: string;       // name text color class
  roleColor: string;       // eyebrow role color
  accentHex: string;       // hex for dot
  borderClass: string;
  isDark: boolean;
}

const TEAM: readonly TeamMember[] = [
  {
    id: 1,
    name: "Dr. Amaka Okafor",
    role: "Founder & Lead Clinician",
    specialty: "Clinical dermatology",
    bio: "Fifteen years bridging evidence-based medicine and sanctuary ritual. Paris-trained, Lagos-rooted.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85&auto=format&fit=crop",
    cardBg: "bg-mauve/20",
    nameColor: "text-deep",
    roleColor: "text-mauve",
    accentHex: "#8A6F88",
    borderClass: "border-mauve/35",
    isDark: false,
  },
  {
    id: 2,
    name: "Chiamaka Eze",
    role: "Head of Spa Therapy",
    specialty: "Hydrotherapy & ritual",
    bio: "A choreographer of stillness. Chiamaka designs the pacing and presence of every spa journey.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85&auto=format&fit=crop",
    cardBg: "bg-sage/25",
    nameColor: "text-deep",
    roleColor: "text-sage",
    accentHex: "#4F7288",
    borderClass: "border-sage/40",
    isDark: false,
  },
  {
    id: 3,
    name: "Fatima Ibrahim",
    role: "Master Lash Artisan",
    specialty: "Architectural eyelash design",
    bio: "Trained in Tokyo. Fatima approaches every lash as a line in a larger composition.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=85&auto=format&fit=crop",
    cardBg: "bg-deep",
    nameColor: "text-ivory",
    roleColor: "text-mauve",
    accentHex: "#F4F2F3",
    borderClass: "border-deep-dark",
    isDark: true,
  },
  {
    id: 4,
    name: "Adaeze Okonkwo",
    role: "Client Experience Director",
    specialty: "Bespoke skincare programs",
    bio: "Your first and last point of contact. Adaeze ensures every ritual is as considered as the client.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=85&auto=format&fit=crop",
    cardBg: "bg-gradient-to-br from-ivory to-mauve/15",
    nameColor: "text-deep",
    roleColor: "text-deep",
    accentHex: "#47676A",
    borderClass: "border-deep/25",
    isDark: false,
  },
] as const;

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

function TeamCard({ member, index }: TeamCardProps): React.ReactElement {
  const offset = index % 2 === 1 ? "lg:mt-16" : "lg:mt-0";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-[2rem] overflow-hidden border-2 ${member.cardBg} ${member.borderClass} transition-all duration-700 hover:shadow-[0_30px_60px_rgba(71,103,106,0.18)] ${offset}`}
    >
      {/* Portrait */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-[1.4s] ease-cinematic group-hover:scale-[1.06]"
        />

        {/* Colored overlay tint */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-25 mix-blend-multiply transition-opacity duration-700"
          style={{ backgroundColor: member.accentHex }}
        />

        {/* Gradient to bottom for social icons */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/55 via-transparent to-transparent" />

        {/* Specialty pill */}
        <div className="absolute top-5 left-5">
          <span
            className="eyebrow inline-flex px-3 py-1.5 rounded-full bg-ivory/95 backdrop-blur-md text-deep text-[9px] border border-white/60"
          >
            {member.specialty}
          </span>
        </div>

        {/* Decorative number */}
        <span
          className="absolute top-4 right-5 font-display text-5xl font-light leading-none text-ivory/70 tracking-tighter pointer-events-none select-none"
          aria-hidden
        >
          0{index + 1}
        </span>

        {/* Socials */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <a
            href="#"
            aria-label={`${member.name} on Instagram`}
            className="h-9 w-9 rounded-full bg-ivory/95 backdrop-blur-md flex items-center justify-center text-deep hover:bg-mauve hover:text-ivory transition-colors"
          >
            <Instagram className="h-4 w-4" strokeWidth={1.5} />
          </a>
          <a
            href="#"
            aria-label={`${member.name} on LinkedIn`}
            className="h-9 w-9 rounded-full bg-ivory/95 backdrop-blur-md flex items-center justify-center text-deep hover:bg-sage hover:text-ivory transition-colors"
          >
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="relative p-7 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: member.accentHex }}
          />
          <span className={`eyebrow ${member.roleColor} text-[10px]`}>
            {member.role}
          </span>
        </div>

        <h3
          className={`font-display text-2xl sm:text-[1.75rem] font-light leading-tight tracking-tight ${member.nameColor}`}
        >
          {member.name}
        </h3>

        <div
          className={`h-px my-5 transition-all duration-500 group-hover:w-24 w-12`}
          style={{ backgroundColor: member.accentHex, opacity: member.isDark ? 0.6 : 0.5 }}
        />

        <p
          className={`text-sm font-light leading-relaxed ${
            member.isDark ? "text-ivory/75" : "text-deep/70"
          }`}
        >
          {member.bio}
        </p>
      </div>
    </motion.article>
  );
}

export function TeamGrid(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-ivory">
      {/* Ambient orbs */}
      <div
        className="absolute top-20 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-20 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <span className="eyebrow text-mauve text-[11px] block mb-5">
              — Chapter Five
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-deep text-balance">
              The master artisans behind every ritual.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 lg:col-start-9"
          >
            <p className="text-base font-light text-deep/70 leading-relaxed">
              Our team is small by design. Everyone who works here has been chosen, trained, and continuously mentored — because the quality of your experience begins with the people who make it possible.
            </p>
          </motion.div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {TEAM.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}