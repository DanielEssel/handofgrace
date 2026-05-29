"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/form-fields";
import { useAuth } from "@/components/auth/AuthProvider";
import { SITE } from "@/data/site";

type Mode = "signin" | "signup";

export function AuthModal({
  open,
  onClose,
  initialMode = "signin",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setError(null);
    setBusy(false);
  };

  const submit = async () => {
    reset();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password, name.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not authenticate.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-3xl border border-navy/10 bg-white p-7 shadow-card"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-xl text-navy/40 transition-colors hover:bg-slatebg hover:text-navy"
            >
              <X className="size-5" />
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
              {SITE.shortName}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-navy">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "signin"
                ? "Sign in to track your application status."
                : "Create an account to apply and follow your progress."}
            </p>

            <div className="mt-6 space-y-3">
              {mode === "signup" && (
                <Field
                  label="Full Name"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <Field
                label="Email Address"
                icon={Mail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Field
                label="Password"
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </div>

            {error && (
              <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            )}

            <Button
              variant="primary"
              size="lg"
              onClick={submit}
              disabled={busy}
              className="mt-5 w-full"
            >
              {busy && <Loader2 className="animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>

            <p className="mt-4 text-center text-sm text-slate-500">
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  reset();
                }}
                className="font-semibold text-gold-600 hover:underline"
              >
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
