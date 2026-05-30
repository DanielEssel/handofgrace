import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Domain enums / unions                                                     */
/* -------------------------------------------------------------------------- */

export type CourseCategory = "software" | "hardware" | "church-media";

export type Gender = "male" | "female" | "other";

export type EducationLevel = "basic" | "jhs" | "shs" | "tertiary";

export type CertificateType = "certificate" | "diploma";

export type SchedulePreference = "weekdays" | "weekends" | "any";

export type CourseDuration = "3-months" | "2.5-years";

/* -------------------------------------------------------------------------- */
/*  Catalog / content models                                                  */
/* -------------------------------------------------------------------------- */

export interface Course {
  id: string;
  label: string;
  description: string;
  category: CourseCategory;
}

export interface ProgramCategory {
  id: CourseCategory;
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string; // tailwind class fragment for accent treatment
  courses: {
    name: string;
    icon: LucideIcon;
    blurb: string;
  }[];
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavLink {
  label: string;
  href: string;
}

/* -------------------------------------------------------------------------- */
/*  Multi-step registration form                                              */
/* -------------------------------------------------------------------------- */

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  town: string;
  dateOfBirth: string;
  gender: Gender;
  languages: string;
}

export interface EducationBackground {
  level: EducationLevel;
  institution: string;
  fromYear: string;
  toYear: string;
  attendedDetails?: string;
  
}

export interface EnrollmentPreferences {
  certificateType: CertificateType;
  schedule: SchedulePreference;
  duration: CourseDuration;
}

export interface GuarantorInfo {
  guarantorName: string;
  guarantorContact: string;
  guarantorAgreement: boolean;
}

export interface Declaration {
  acceptTerms: boolean;
  acceptFees: boolean;
  acceptMisconduct: boolean;
  signature: string;
}

/** The full, flattened form payload used by react-hook-form + zod. */
export interface RegistrationFormValues
  extends PersonalDetails,
    EducationBackground,
    EnrollmentPreferences,
    GuarantorInfo,
    Declaration {
  selectedCourses: string[];
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Field names belonging to this step — used for per-step validation. */
  fields: (keyof RegistrationFormValues)[];
}

/* -------------------------------------------------------------------------- */
/*  Payment (Paystack)                                                        */
/* -------------------------------------------------------------------------- */

export type PaymentStatus =
  | "idle"
  | "initializing"
  | "processing"
  | "verifying"
  | "success"
  | "error";

export interface PaystackSuccessResponse {
  reference: string;
  status: string;
  trans?: string;
  transaction?: string;
  message?: string;
}

export interface PaymentResult {
  status: PaymentStatus;
  reference?: string;
  message?: string;
}

/* -------------------------------------------------------------------------- */
/*  Persistence (Firebase)                                                    */
/* -------------------------------------------------------------------------- */

export type ApplicationStatus =
  | "pending_review"
  | "under_review"
  | "accepted"
  | "rejected";

/** A file selected in the browser, encoded for transport to the API route. */
export interface UploadInput {
  /** Logical slot, e.g. "photo" | "document". */
  field: string;
  name: string;
  type: string;
  /** Base64 (no data: prefix). */
  dataBase64: string;
}

/** A stored file reference saved on the application document. */
export interface StoredUpload {
  field: string;
  name: string;
  type: string;
  url: string;
  path: string;
}

/** Payload POSTed from the browser to /api/applications. */
export interface ApplicationSubmission {
  application: RegistrationFormValues;
  reference: string;
  uid?: string | null;
  uploads?: UploadInput[];
}

/** The shape stored in Firestore (and read back on the dashboard). */
export interface ApplicationRecord {
  id: string;
  uid: string | null;
  status: ApplicationStatus;
  reference: string;
  paymentVerified: boolean;
  amountPesewas: number;
  currency: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  selectedCourses: string[];
  certificateType: string;
  schedule: string;
  duration: string;
  uploads: StoredUpload[];
  /** ISO string once normalised for the client. */
  createdAt: string | null;
  /** Full original form payload, for staff/admin reference. */
  details: RegistrationFormValues;
}
