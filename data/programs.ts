import {
  Code2,
  MonitorSmartphone,
  PenTool,
  Cpu,
  Network,
  HardDrive,
  Radio,
  Mic2,
  Camera,
  Presentation,
  Building2,
  Globe,
} from "lucide-react";
import type { Course, CourseCategory, ProgramCategory } from "@/types";

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  {
    id: "software",
    title: "Software",
    tagline: "Master the tools that power the modern digital workplace.",
    icon: Code2,
    accent: "from-gold/20 to-gold/5",
    courses: [
      {
        name: "Intro to IT",
        icon: MonitorSmartphone,
        blurb: "Computer fundamentals, productivity & digital literacy.",
      },
      {
        name: "MS Office Suite",
        icon: Presentation,
        blurb: "Word, Excel, PowerPoint & professional document skills.",
      },
      {
        name: "Graphic Design",
        icon: PenTool,
        blurb: "Branding, layouts & visual storytelling for print & web.",
      },
      {
        name: "Website Development (Non-Coding)",
        icon: Globe,
        blurb: "Build modern responsive sites with no-code builders.",
      },
    
    ],
  },
  {
    id: "hardware",
    title: "Hardware",
    tagline: "Repair, build and connect the machines behind the screen.",
    icon: Cpu,
    accent: "from-navy-400/20 to-navy-400/5",
    courses: [
      {
        name: "System Engineering (CompTIA A+)",
        icon: HardDrive,
        blurb: "Assemble, diagnose & maintain computer systems.",
      },
      {
        name: "Networking (N+)",
        icon: Network,
        blurb: "Design, configure & secure modern networks.",
      },
    ],
  },
  {
    id: "church-media",
    title: "Church Media",
    tagline: "Production skills for worship, broadcast & digital ministry.",
    icon: Radio,
    accent: "from-gold/20 to-navy-400/5",
    courses: [
      {
        name: "Live Audio & Streaming",
        icon: Radio,
        blurb: "Sound engineering & live broadcast for services.",
      },
            {
        name: "Social Media / Digital Communications",
        icon: Mic2,
        blurb: "Grow & manage a ministry's digital presence.",
      },
      {
        name: "Content Creation",
        icon: Camera,
        blurb: "Photography, video & storytelling for impact.",
      },
    ],
  },
];

/** Flat, selectable course list used by the registration form. */
export const COURSES: Course[] = [
  // Software
  { id: "intro-it", label: "Intro to IT", description: "Software", category: "software" },
  { id: "ms-office", label: "MS Office Suite", description: "Software", category: "software" },
  { id: "graphic-design", label: "Graphic Design", description: "Software", category: "software" },
  { id: "web-dev", label: "Website Development", description: "Software", category: "software" },
  { id: "arch-drawing", label: "Architectural Drawing", description: "Software", category: "software" },
  // Hardware
  { id: "system-eng", label: "System Engineering", description: "Hardware", category: "hardware" },
  { id: "networking", label: "Networking", description: "Hardware", category: "hardware" },
  // Church Media
  { id: "live-audio", label: "Live Audio & Streaming", description: "Church Media", category: "church-media" },
  { id: "graphics-presentation", label: "Graphics & Presentation", description: "Church Media", category: "church-media" },
  { id: "social-media", label: "Social Media / Digital Communications", description: "Church Media", category: "church-media" },
  { id: "content-creation", label: "Content Creation", description: "Church Media", category: "church-media" },
];

export const COURSE_GROUP_LABELS: Record<CourseCategory, string> = {
  software: "Software",
  hardware: "Hardware",
  "church-media": "Church Media",
};

export function coursesByCategory(category: CourseCategory): Course[] {
  return COURSES.filter((c) => c.category === category);
}
