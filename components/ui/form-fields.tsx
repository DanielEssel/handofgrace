"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Error text                                                                */
/* -------------------------------------------------------------------------- */

export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <AlertCircle className="size-3.5" />
      {message}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating-label input field                                                */
/* -------------------------------------------------------------------------- */

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, icon: Icon, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="w-full">
        <div
          className={cn(
            "group relative rounded-2xl border bg-white transition-all duration-200",
            "focus-within:border-gold/60 focus-within:shadow-glow",
            error ? "border-destructive/50" : "border-input hover:border-navy/25",
          )}
        >
          {Icon && (
            <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/35 transition-colors group-focus-within:text-gold-600" />
          )}
          <input
            ref={ref}
            id={fieldId}
            placeholder=" "
            className={cn(
              "peer h-14 w-full rounded-2xl bg-transparent px-4 pt-5 pb-1.5 text-sm font-medium text-ink outline-none placeholder:text-transparent",
              Icon && "pl-11",
              className,
            )}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-navy/45 transition-all duration-200",
              "peer-focus:top-3.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-gold-600",
              "peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-navy/55",
              Icon ? "left-11" : "left-4",
            )}
          >
            {label}
          </label>
        </div>
        <ErrorText message={error} />
      </div>
    );
  },
);
Field.displayName = "Field";

/* -------------------------------------------------------------------------- */
/*  Textarea                                                                  */
/* -------------------------------------------------------------------------- */

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="w-full">
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-navy/55"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={fieldId}
          rows={3}
          className={cn(
            "w-full rounded-2xl border bg-white px-4 py-3 text-sm font-medium text-ink outline-none transition-all duration-200",
            "focus:border-gold/60 focus:shadow-glow",
            error ? "border-destructive/50" : "border-input hover:border-navy/25",
            className,
          )}
          {...props}
        />
        <ErrorText message={error} />
      </div>
    );
  },
);
TextArea.displayName = "TextArea";

/* -------------------------------------------------------------------------- */
/*  Select                                                                    */
/* -------------------------------------------------------------------------- */

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectField = React.forwardRef<
  HTMLSelectElement,
  SelectFieldProps
>(
  (
    { label, icon: Icon, error, options, placeholder, className, id, ...props },
    ref,
  ) => {
    const fieldId = id ?? props.name;
    return (
      <div className="w-full">
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-navy/55"
        >
          {label}
        </label>
        <div
          className={cn(
            "group relative rounded-2xl border bg-white transition-all duration-200",
            "focus-within:border-gold/60 focus-within:shadow-glow",
            error ? "border-destructive/50" : "border-input hover:border-navy/25",
          )}
        >
          {Icon && (
            <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-navy/35 group-focus-within:text-gold-600" />
          )}
          <select
            ref={ref}
            id={fieldId}
            className={cn(
              "h-14 w-full cursor-pointer appearance-none rounded-2xl bg-transparent px-4 text-sm font-medium text-ink outline-none",
              Icon && "pl-11",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-navy/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <ErrorText message={error} />
      </div>
    );
  },
);
SelectField.displayName = "SelectField";

/* -------------------------------------------------------------------------- */
/*  Radio card group                                                          */
/* -------------------------------------------------------------------------- */

interface RadioCardProps {
  checked: boolean;
  label: string;
  description?: string;
  onSelect: () => void;
}

export function RadioCard({
  checked,
  label,
  description,
  onSelect,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={checked}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
        checked
          ? "border-gold bg-gold/8 shadow-glow"
          : "border-input bg-white hover:border-navy/25 hover:shadow-soft",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-gold bg-gold" : "border-navy/25 group-hover:border-navy/40",
        )}
      >
        {checked && <span className="size-2 rounded-full bg-navy" />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-navy/50">{description}</span>
        )}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Checkbox card                                                             */
/* -------------------------------------------------------------------------- */

interface CheckCardProps {
  checked: boolean;
  label: string;
  description?: string;
  onToggle: () => void;
}

export function CheckCard({
  checked,
  label,
  description,
  onToggle,
}: CheckCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
        checked
          ? "border-gold bg-gold/8 shadow-glow"
          : "border-input bg-white hover:border-navy/25 hover:shadow-soft",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
          checked
            ? "border-gold bg-gold text-navy"
            : "border-navy/25 group-hover:border-navy/40",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-navy/40">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline checkbox (for declarations)                                        */
/* -------------------------------------------------------------------------- */

interface ConsentCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
  children: React.ReactNode;
}

export function ConsentCheckbox({
  checked,
  onToggle,
  error,
  children,
}: ConsentCheckboxProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={cn(
          "group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
          checked
            ? "border-gold/60 bg-gold/5"
            : error
              ? "border-destructive/40 bg-white"
              : "border-input bg-white hover:border-navy/25",
        )}
      >
        <span
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
            checked ? "border-gold bg-gold text-navy" : "border-navy/25",
          )}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </span>
        <span className="text-sm leading-relaxed text-navy/75">{children}</span>
      </button>
      <ErrorText message={error} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  File upload field                                                         */
/* -------------------------------------------------------------------------- */

interface FileFieldProps {
  label: string;
  hint?: string;
  icon?: LucideIcon;
  accept?: string;
  /** Max size in MB (client-side soft check). */
  maxSizeMb?: number;
  file: File | null;
  onSelect: (file: File | null) => void;
  error?: string;
}

export function FileField({
  label,
  hint,
  icon: Icon,
  accept = "image/*,application/pdf",
  maxSizeMb = 3,
  file,
  onSelect,
  error,
}: FileFieldProps) {
  const [localError, setLocalError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handle = (f: File | null) => {
    setLocalError(null);
    if (f && f.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`File must be under ${maxSizeMb} MB.`);
      onSelect(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onSelect(f);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-dashed bg-white px-4 py-3.5 text-left transition-colors",
          file
            ? "border-gold/60 bg-gold/5"
            : "border-input hover:border-navy/30",
        )}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy/5 text-navy/45">
          {Icon ? <Icon className="size-5" /> : <Check className="size-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-navy">
            {file ? file.name : label}
          </span>
          <span className="block truncate text-xs text-navy/45">
            {file ? "Tap to replace" : (hint ?? `Image or PDF · up to ${maxSizeMb} MB`)}
          </span>
        </span>
        {file && (
          <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold-600">
            Selected
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />
      <ErrorText message={localError ?? error} />
    </div>
  );
}
