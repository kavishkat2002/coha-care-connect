import { createFileRoute } from "@tanstack/react-router";

import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  AiFeatures,
  CancerScreening,
  Contact,
  Faq,
  Hero,
  HowItWorks,
  PlatformOverview,
  Services,
  Stats,
  Telemedicine,
  Testimonials,
} from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COHA AI — AI-Powered Healthcare & Early Cancer Screening" },
      {
        name: "description",
        content:
          "Book appointments, chat with an AI health assistant, analyse medical images and reports, and consult online — all in one healthcare platform.",
      },
      { property: "og:title", content: "COHA AI — AI-Powered Healthcare & Early Cancer Screening" },
      {
        property: "og:description",
        content:
          "AI-assisted assessments, specialist recommendation and telemedicine for patients, doctors and hospitals.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />
      <main>
        <Hero />
        <PlatformOverview />
        <HowItWorks />
        <Services />
        <AiFeatures />
        <CancerScreening />
        <Telemedicine />
        <Stats />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <LandingFooter />
    </div>
  );
}
