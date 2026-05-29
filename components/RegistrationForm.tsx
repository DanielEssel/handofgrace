"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Languages,
  School,
  BadgeCheck,
  PartyPopper,
  Camera,
  FileText,
  Loader2,
  AlertTriangle,
  Download,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  SelectField,
  TextArea,
  RadioCard,
  CheckCard,
  ConsentCheckbox,
  ErrorText,
  FileField,
} from "@/components/ui/form-fields";
import { PaystackButton } from "@/components/PaystackButton";
import { useAuth } from "@/components/auth/AuthProvider";

import { FORM_STEPS } from "@/data/content";
import { COURSE_GROUP_LABELS, coursesByCategory } from "@/data/programs";
import { APPLICATION_FEE } from "@/data/site";
import { registrationSchema } from "@/lib/validation";
import { cn, formatCedis } from "@/lib/utils";
import { fileToUpload, submitApplication } from "@/lib/firebase/applications";
import { downloadReceipt } from "@/lib/receipt";
import type { CourseCategory, RegistrationFormValues } from "@/types";

const CATEGORIES: CourseCategory[] = ["software", "hardware", "church-media"];

export function RegistrationForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [paid, setPaid] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      selectedCourses: [],
      gender: undefined,
      level: undefined,
      
      certificateType: undefined,
      schedule: undefined,
      duration: undefined,
      acceptTerms: false,
      acceptFees: false,
      acceptMisconduct: false,
      guarantorAgreement: false,
    } as Partial<RegistrationFormValues> as RegistrationFormValues,
  });

  const values = watch();
  const isComplete = useMemo(
    () => registrationSchema.safeParse(values).success,
    [values],
  );

  // Prefill the email for signed-in applicants (one-time, only if still blank).
  useEffect(() => {
    if (user?.email && !values.email) {
      setValue("email", user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const currentStep = FORM_STEPS[step];
  const isLast = step === FORM_STEPS.length - 1;
  const progress = ((step + 1) / FORM_STEPS.length) * 100;

  const goNext = async () => {
    const valid = await trigger(currentStep.fields);
    if (valid) setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const toggleCourse = (id: string) => {
    const current = values.selectedCourses ?? [];
    const next = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    setValue("selectedCourses", next, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
    if (!paid || !reference) return; // hard guard — never submit before payment
    setSubmitting(true);
    setSubmitError(null);
    try {
      const uploads = [];
      if (photo) uploads.push(await fileToUpload("photo", photo));
      if (documentFile) uploads.push(await fileToUpload("document", documentFile));

      await submitApplication({
        application: data,
        reference,
        uid: user?.uid ?? null,
        uploads,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "We couldn't submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------- Success state ---------------------------- */
  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-gold/30 bg-white p-10 text-center shadow-card">
        <span className="grid size-16 place-items-center rounded-2xl bg-gold/15 text-gold-600">
          <PartyPopper className="size-8" />
        </span>
        <h3 className="mt-5 font-heading text-2xl font-bold text-navy">
          Application Received!
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Thank you, {values.firstName}. Your registration and{" "}
          {formatCedis(APPLICATION_FEE)} application fee have been received. Our
          admissions team will contact you on {values.mobile} shortly.
        </p>
        {reference && (
          <p className="mt-4 rounded-full bg-slatebg px-4 py-2 text-xs font-semibold text-navy/60">
            Payment Ref: {reference}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            variant="primary"
            size="md"
            onClick={() =>
              reference &&
              downloadReceipt({
                application: values,
                reference,
                amountPesewas: APPLICATION_FEE * 100,
                status: "pending_review",
                createdAt: new Date().toISOString(),
              })
            }
          >
            <Download /> Download Receipt (PDF)
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="md" className="w-full">
              <LayoutDashboard /> View My Applications
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-navy/45">
          You can also re-download this receipt anytime from your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-card sm:p-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
              Step {step + 1} of {FORM_STEPS.length}
            </p>
            <h3 className="mt-0.5 font-heading text-xl font-bold text-navy">
              {currentStep.title}
            </h3>
            <p className="text-sm text-slate-500">{currentStep.description}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-navy text-gold-300">
            <currentStep.icon className="size-6" />
          </span>
        </div>

        {/* Stepper dots */}
        <div className="mt-5 flex items-center gap-1.5">
          {FORM_STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-1.5">
              <div
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  i <= step ? "bg-gold-sheen" : "bg-navy/10",
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ----------------------------- STEP 1 ---------------------------- */}
            {currentStep.id === "personal" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" icon={User} {...register("firstName")} error={errors.firstName?.message} />
                <Field label="Last Name" icon={User} {...register("lastName")} error={errors.lastName?.message} />
                <Field label="Email Address" icon={Mail} type="email" {...register("email")} error={errors.email?.message} />
                <Field label="Mobile Number" icon={Phone} inputMode="tel" {...register("mobile")} error={errors.mobile?.message} />
                <Field label="Town" icon={MapPin} {...register("town")} error={errors.town?.message} />
                <Field label="Date of Birth" icon={Calendar} type="date" {...register("dateOfBirth")} error={errors.dateOfBirth?.message} />
                <div className="sm:col-span-2">
                  <Field label="Residential Address" icon={MapPin} {...register("address")} error={errors.address?.message} />
                </div>
                <SelectField
                  label="Gender"
                  placeholder="Select gender"
                  {...register("gender")}
                  error={errors.gender?.message}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
                <Field label="Languages Spoken" icon={Languages} {...register("languages")} error={errors.languages?.message} />
              </div>
            )}

            {/* ----------------------------- STEP 2 ---------------------------- */}
            {currentStep.id === "education" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Education Level"
                  placeholder="Select level"
                  {...register("level")}
                  error={errors.level?.message}
                  options={[
                    { value: "basic", label: "Basic" },
                    { value: "jhs", label: "JHS" },
                    { value: "shs", label: "SHS" },
                    { value: "tertiary", label: "Tertiary" },
                  ]}
                />
                <Field label="Institution Name" icon={School} {...register("institution")} error={errors.institution?.message} />
                <Field label="From (Year)" inputMode="numeric" maxLength={4} {...register("fromYear")} error={errors.fromYear?.message} />
                <Field label="To (Year)" inputMode="numeric" maxLength={4} {...register("toYear")} error={errors.toYear?.message} />
              </div>
            )}

            {/* ----------------------------- STEP 3 ---------------------------- */}
            {currentStep.id === "courses" && (
              <div className="space-y-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-navy">
                      <span className="h-4 w-1 rounded-full bg-gold" />
                      {COURSE_GROUP_LABELS[cat]}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {coursesByCategory(cat).map((course) => (
                        <CheckCard
                          key={course.id}
                          label={course.label}
                          description={course.description}
                          checked={(values.selectedCourses ?? []).includes(course.id)}
                          onToggle={() => toggleCourse(course.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <ErrorText message={errors.selectedCourses?.message as string} />
              </div>
            )}

            {/* ----------------------------- STEP 4 ---------------------------- */}
            {currentStep.id === "preferences" && (
              <div className="space-y-6">
                <PreferenceGroup
                  title="Certificate Type"
                  field="certificateType"
                  value={values.certificateType}
                  error={errors.certificateType?.message}
                  setValue={setValue}
                  options={[
                    { value: "certificate", label: "Certificate" },
                    { value: "diploma", label: "Diploma" },
                  ]}
                />
                <PreferenceGroup
                  title="Schedule"
                  field="schedule"
                  value={values.schedule}
                  error={errors.schedule?.message}
                  setValue={setValue}
                  options={[
                    { value: "weekdays", label: "Weekdays" },
                    { value: "weekends", label: "Weekends" },
                    { value: "any", label: "Any" },
                  ]}
                />
                <PreferenceGroup
                  title="Duration"
                  field="duration"
                  value={values.duration}
                  error={errors.duration?.message}
                  setValue={setValue}
                  options={[
                    { value: "3-months", label: "3 Months" },
                    { value: "2.5-years", label: "2.5 Years" },
                  ]}
                />
              </div>
            )}

            {/* ----------------------------- STEP 5 ---------------------------- */}
            {currentStep.id === "guarantor" && (
              <div className="grid gap-4">
                <Field label="Guarantor Name" icon={User} {...register("guarantorName")} error={errors.guarantorName?.message} />
                <Field label="Guarantor Contact" icon={Phone} inputMode="tel" {...register("guarantorContact")} error={errors.guarantorContact?.message} />
                <ConsentCheckbox
                  checked={!!values.guarantorAgreement}
                  onToggle={() =>
                    setValue("guarantorAgreement", !values.guarantorAgreement, {
                      shouldValidate: true,
                    })
                  }
                  error={errors.guarantorAgreement?.message as string}
                >
                  My guarantor agrees to stand for me throughout my training at
                  Hand of Grace Multimedia &amp; I.T College.
                </ConsentCheckbox>
              </div>
            )}

            {/* ----------------------------- STEP 6 ---------------------------- */}
            {currentStep.id === "declaration" && (
              <div className="space-y-4">
                <ConsentCheckbox
                  checked={!!values.acceptTerms}
                  onToggle={() =>
                    setValue("acceptTerms", !values.acceptTerms, { shouldValidate: true })
                  }
                  error={errors.acceptTerms?.message as string}
                >
                  I accept the terms and conditions of admission and study.
                </ConsentCheckbox>
                <ConsentCheckbox
                  checked={!!values.acceptFees}
                  onToggle={() =>
                    setValue("acceptFees", !values.acceptFees, { shouldValidate: true })
                  }
                  error={errors.acceptFees?.message as string}
                >
                  I acknowledge the application and tuition fees, and understand
                  they are required to complete enrollment.
                </ConsentCheckbox>
                <ConsentCheckbox
                  checked={!!values.acceptMisconduct}
                  onToggle={() =>
                    setValue("acceptMisconduct", !values.acceptMisconduct, {
                      shouldValidate: true,
                    })
                  }
                  error={errors.acceptMisconduct?.message as string}
                >
                  I agree to abide by the college&apos;s code of conduct and
                  understand the consequences of misconduct.
                </ConsentCheckbox>

                <Field
                  label="Signature (type your full name)"
                  icon={BadgeCheck}
                  {...register("signature")}
                  error={errors.signature?.message}
                />

                {/* Supporting documents (optional) */}
                <div className="space-y-3 rounded-2xl border border-navy/10 bg-slatebg/60 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/55">
                    Supporting Documents · Optional
                  </p>
                  <FileField
                    label="Passport Photo"
                    hint="Clear headshot · JPG or PNG · up to 3 MB"
                    icon={Camera}
                    accept="image/*"
                    file={photo}
                    onSelect={setPhoto}
                  />
                  <FileField
                    label="Certificate / Results Slip"
                    hint="Image or PDF · up to 3 MB"
                    icon={FileText}
                    accept="image/*,application/pdf"
                    file={documentFile}
                    onSelect={setDocumentFile}
                  />
                </div>

                {/* Payment block */}
                <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5">
                  <p className="text-sm font-semibold text-navy">
                    Application Fee · {formatCedis(APPLICATION_FEE)}
                  </p>
                  <p className="mb-4 mt-0.5 text-xs text-navy/55">
                    Complete payment to unlock submission. Submission stays
                    locked until your payment succeeds.
                  </p>
                  <PaystackButton
                    email={values.email}
                    name={`${values.firstName ?? ""} ${values.lastName ?? ""}`.trim()}
                    disabled={!isComplete}
                    onPaymentSuccess={(ref) => {
                      setPaid(true);
                      setReference(ref);
                    }}
                  />
                  {!isComplete && (
                    <p className="mt-2 text-center text-xs text-navy/45">
                      Complete all previous steps to enable payment.
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer controls */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={goBack}
            disabled={step === 0}
            className={cn(step === 0 && "invisible")}
          >
            <ArrowLeft /> Back
          </Button>

          {!isLast ? (
            <Button type="button" variant="navy" size="md" onClick={goNext}>
              Continue <ArrowRight />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isComplete || !paid || submitting}
              className={isComplete && paid && !submitting ? "shimmer-overlay" : ""}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Check /> Submit Application
                </>
              )}
            </Button>
          )}
        </div>

        {submitError && (
          <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-center text-xs font-medium text-destructive">
            <AlertTriangle className="size-3.5 shrink-0" />
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Small preference radio group                                              */
/* -------------------------------------------------------------------------- */

interface PreferenceGroupProps {
  title: string;
  field: "certificateType" | "schedule" | "duration";
  value: unknown;
  error?: string;
  options: { value: string; label: string }[];
  setValue: UseFormSetValue<RegistrationFormValues>;
}

function PreferenceGroup({
  title,
  field,
  value,
  error,
  options,
  setValue,
}: PreferenceGroupProps) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-navy/55">
        {title}
      </p>
      <div
        className={cn(
          "grid gap-3",
          options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((o) => (
          <RadioCard
            key={o.value}
            label={o.label}
            checked={value === o.value}
            onSelect={() =>
              setValue(
                field,
                o.value as RegistrationFormValues[typeof field],
                { shouldValidate: true },
              )
            }
          />
        ))}
      </div>
      <ErrorText message={error} />
    </div>
  );
}
