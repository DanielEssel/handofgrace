import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHeader } from "@/components/PageHeader";
import { TrainingPrograms } from "@/components/TrainingPrograms";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore hands-on ICT training at Hand of Grace College — software, hardware and church media courses, from graphic design and networking to live audio and streaming.",
};

export default function ProgramsPage() {
  return (
    <SiteShell>
      <PageHeader
        current="Training Programs"
        kicker="Training Programs"
        title="Choose your path into technology"
        description="Practical, mentor-led courses across software, hardware and church media — designed to make you career-ready."
      />
      <TrainingPrograms />
    </SiteShell>
  );
}
