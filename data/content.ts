import {
  Laptop,
  Wrench,
  ShoppingBag,
  Headphones,
  Smartphone,
  LifeBuoy,
  GraduationCap,
  Users,
  Award,
  Rocket,
  Target,
  Eye,
  HeartHandshake,
  Lightbulb,
  User,
  School,
  BookOpen,
  SlidersHorizontal,
  ShieldCheck,
  FileSignature,
} from "lucide-react";
import type { FeatureItem, FormStep, ServiceItem, StatItem } from "@/types";

export const SERVICES: ServiceItem[] = [
  {
    title: "Computer Sales",
    description:
      "Quality desktops & laptops for students, professionals and businesses.",
    icon: Laptop,
  },
  {
    title: "Laptop Repairs",
    description:
      "Fast, reliable diagnostics and repairs by certified technicians.",
    icon: Wrench,
  },
  {
    title: "Accessories",
    description:
      "Keyboards, drives, cables, chargers and everyday computing essentials.",
    icon: ShoppingBag,
  },
  {
    title: "Electronic Gadgets",
    description:
      "Modern smart devices and gadgets to keep you connected and productive.",
    icon: Smartphone,
  },
  {
    title: "Audio & Peripherals",
    description:
      "Headphones, microphones and media gear for work, study and ministry.",
    icon: Headphones,
  },
  {
    title: "Tech Support",
    description:
      "Setup, maintenance and ongoing support for individuals and teams.",
    icon: LifeBuoy,
  },
];

export const STATS: StatItem[] = [
  { value: "11+", label: "Career-ready courses", icon: GraduationCap },
  { value: "100%", label: "Hands-on practical training", icon: Rocket },
  { value: "3", label: "Specialised departments", icon: Award },
  { value: "All", label: "Levels welcome", icon: Users },
];

export const ABOUT_FEATURES: FeatureItem[] = [
  {
    title: "Our Mission",
    description:
      "To equip young people in Awutu Bawjiase and beyond with practical, future-ready ICT skills that open real career opportunities.",
    icon: Target,
  },
  {
    title: "Our Vision",
    description:
      "To become a leading community college shaping confident, digitally-skilled professionals who power Ghana's growing tech economy.",
    icon: Eye,
  },
  {
    title: "Training Philosophy",
    description:
      "Learn by doing. Every program is hands-on, mentor-led and built around the tools employers actually use today.",
    icon: Lightbulb,
  },
  {
    title: "Educational Impact",
    description:
      "We empower students with skills, certificates and the confidence to build careers, start businesses and serve their communities.",
    icon: HeartHandshake,
  },
];

/* Steps for the multi-step registration form. */
export const FORM_STEPS: FormStep[] = [
  {
    id: "personal",
    title: "Personal Details",
    description: "Tell us who you are",
    icon: User,
    fields: [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "address",
      "town",
      "dateOfBirth",
      "gender",
      "languages",
    ],
  },
  {
    id: "education",
    title: "Education",
    description: "Your academic background",
    icon: School,
    fields: [
      "level",
      "institution",
      "fromYear",
      "toYear",
    ],
  },
  {
    id: "courses",
    title: "Courses",
    description: "Choose your programs",
    icon: BookOpen,
    fields: ["selectedCourses"],
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Certificate & schedule",
    icon: SlidersHorizontal,
    fields: ["certificateType", "schedule", "duration"],
  },
  {
    id: "guarantor",
    title: "Guarantor",
    description: "A trusted contact",
    icon: ShieldCheck,
    fields: ["guarantorName", "guarantorContact", "guarantorAgreement"],
  },
  {
    id: "declaration",
    title: "Declaration",
    description: "Confirm & pay",
    icon: FileSignature,
    fields: ["acceptTerms", "acceptFees", "acceptMisconduct", "signature"],
  },
];
