import { z } from "zod";

const currentYear = new Date().getFullYear();

const yearString = z
  .string()
  .min(4, "Enter a 4-digit year")
  .regex(/^\d{4}$/, "Enter a valid year")
  .refine(
    (v) => Number(v) >= 1970 && Number(v) <= currentYear + 1,
    "Enter a realistic year",
  );

export const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  mobile: z
    .string()
    .min(9, "Enter a valid mobile number")
    .regex(/^[0-9+\s-]{9,15}$/, "Enter a valid mobile number"),
  address: z.string().min(4, "Address is required"),
  town: z.string().min(2, "Town is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Select your gender" }),
  }),
  languages: z.string().min(2, "Tell us the languages you speak"),
});

export const educationSchema = z
  .object({
    level: z.enum(["basic", "jhs", "shs", "tertiary"], {
      errorMap: () => ({ message: "Select your education level" }),
    }),
    institution: z.string().min(2, "Institution name is required"),
    fromYear: yearString,
    toYear: yearString,
  })
  .refine((data) => Number(data.toYear) >= Number(data.fromYear), {
    message: '"To" year cannot be before "From" year',
    path: ["toYear"],
  });

export const coursesSchema = z.object({
  selectedCourses: z
    .array(z.string())
    .min(1, "Select at least one course to enroll in"),
});

export const preferencesSchema = z.object({
  certificateType: z.enum(["certificate", "diploma"], {
    errorMap: () => ({ message: "Choose a certificate type" }),
  }),
  schedule: z.enum(["weekdays", "weekends", "any"], {
    errorMap: () => ({ message: "Choose a schedule" }),
  }),
  duration: z.enum(["3-months", "2.5-years"], {
    errorMap: () => ({ message: "Choose a duration" }),
  }),
});

export const guarantorSchema = z.object({
  guarantorName: z.string().min(2, "Guarantor name is required"),
  guarantorContact: z
    .string()
    .min(9, "Enter a valid contact")
    .regex(/^[0-9+\s-]{9,15}$/, "Enter a valid contact"),
  guarantorAgreement: z.boolean().refine((v) => v === true, {
    message: "Guarantor must agree to continue",
  }),
});

export const declarationSchema = z.object({
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms",
  }),
  acceptFees: z.boolean().refine((v) => v === true, {
    message: "Please acknowledge the fees",
  }),
  acceptMisconduct: z.boolean().refine((v) => v === true, {
    message: "Please accept the conduct policy",
  }),
  signature: z.string().min(2, "Type your full name as a signature"),
});

/**
 * Full schema = intersection of every step.
 * We use `.and()` because some step schemas use `.refine()` (ZodEffects),
 * which cannot be merged with `.merge()`.
 */
export const registrationSchema = personalSchema
  .and(educationSchema)
  .and(coursesSchema)
  .and(preferencesSchema)
  .and(guarantorSchema)
  .and(declarationSchema);

export type RegistrationSchema = z.infer<typeof registrationSchema>;