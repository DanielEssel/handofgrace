import {
  Network,
  HardDrive,
  Globe,
  Radio,
  Presentation,
} from "lucide-react";
import type { Course, CourseCategory, ProgramCategory } from "@/types";

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  {
    id: "hardware-networking",
    title: "Hardware and Networking",
    tagline: "Understand computer hardware, networks and connectivity.",
    icon: HardDrive,
    accent: "from-blue-500/20 to-blue-500/5",
    courses: [
      {
        name: "Hardware and Networking",
        icon: Network,
        blurb: "Understand computer hardware, networks and connectivity.",
      },
    ],
  },
  {
    id: "website-development",
    title: "Website Development",
    tagline: "Build professional, responsive and dynamic websites.",
    icon: Globe,
    accent: "from-green-500/20 to-green-500/5",
    courses: [
      {
        name: "Website Development",
        icon: Globe,
        blurb: "Build professional, responsive and dynamic websites.",
      },
    ],
  },
  {
    id: "church-media",
    title: "Church Media",
    tagline: "Learn media production, live streaming and digital content creation for ministry.",
    icon: Radio,
    accent: "from-orange-500/20 to-orange-500/5",
    courses: [
      {
        name: "Church Media",
        icon: Radio,
        blurb: "Media production, live streaming and digital content creation for ministry.",
      },
    ],
  },
  {
    id: "ms-office",
    title: "Microsoft Office Suite",
    tagline: "Master Word, Excel, PowerPoint, Outlook and other productivity tools.",
    icon: Presentation,
    accent: "from-purple-500/20 to-purple-500/5",
    courses: [
      {
        name: "Microsoft Office Suite",
        icon: Presentation,
        blurb: "Master Word, Excel, PowerPoint, Outlook and other productivity tools.",
      },
    ],
  },
];

/** Flat, selectable course list — applicant selects ONE course only. */
export const COURSES: Course[] = [
  {
    id: "hardware-networking",
    label: "Hardware and Networking",
    description: "Understand computer hardware, networks and connectivity.",
    category: "hardware-networking",
  },
  {
    id: "website-development",
    label: "Website Development",
    description: "Build professional, responsive and dynamic websites.",
    category: "website-development",
  },
  {
    id: "church-media",
    label: "Church Media",
    description: "Media production, live streaming and digital content creation for ministry.",
    category: "church-media",
  },
  {
    id: "ms-office",
    label: "Microsoft Office Suite",
    description: "Master Word, Excel, PowerPoint, Outlook and other productivity tools.",
    category: "ms-office",
  },
];

export const COURSE_GROUP_LABELS: Record<CourseCategory, string> = {
  "hardware-networking": "Hardware and Networking",
  "website-development": "Website Development",
  "church-media": "Church Media",
  "ms-office": "Microsoft Office Suite",
};

export function coursesByCategory(category: CourseCategory): Course[] {
  return COURSES.filter((c) => c.category === category);
}