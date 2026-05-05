import type { Metadata } from "next";
import { AboutHero } from "../../components/about/AboutHero";
import { FounderLetter } from "@/components/about/FounderLetter";
import { JoinCTA } from "@/components/about/JoinCTA";
import { Milestones } from "@/components/about/Milestones";
import { OurStory } from "../../components/about/OurStory";
import { Philosophy } from "../../components/about/Philosophy";

import { Values } from "@/components/about/Values";


export const metadata: Metadata = {
  title: "About Us — Our Story, Philosophy & Team",
  description:
    "The story, philosophy, and master artisans behind Skin Essential Plus — a sanctuary where science meets serenity.",
};

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <main>
        <AboutHero />
        <OurStory />
        <Philosophy />
        <FounderLetter />
        <Values />
        <Milestones />
        <JoinCTA />
      </main>
    </>
  );
}