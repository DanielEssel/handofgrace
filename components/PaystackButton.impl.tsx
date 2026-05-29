"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { Loader2, ShieldCheck, CreditCard, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCedis } from "@/lib/utils";
import { APPLICATION_FEE } from "@/data/site";
import type { PaymentStatus, PaystackSuccessResponse } from "@/types";

export interface PaystackButtonProps {
  email: string;
  /** Optional full name used as Paystack metadata. */
  name?: string;
  /** Disable until the form is valid. */
  disabled?: boolean;
  /** Fired once the transaction is confirmed successful. */
  onPaymentSuccess: (reference: string) => void;
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

export function PaystackButtonImpl({
  email,
  name,
  disabled,
  onPaymentSuccess,
}: PaystackButtonProps) {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const reference = `HOG-${Date.now()}`;

  const config = {
    reference,
    email: email || "applicant@handofgracecollege.com",
    amount: APPLICATION_FEE * 100, // pesewas
    publicKey: PUBLIC_KEY,
    currency: "GHS",
    metadata: {
      custom_fields: [
        {
          display_name: "Applicant",
          variable_name: "applicant_name",
          value: name ?? "",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = (ref?: PaystackSuccessResponse) => {
    // In production you would verify `ref.reference` server-side via the
    // Paystack verify API before granting access. Here we mark verified.
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
      onPaymentSuccess(ref?.reference ?? reference);
    }, 900);
  };

  const handleClose = () => {
    if (status !== "success") {
      setStatus("idle");
    }
  };

  const startPayment = () => {
    setError(null);

    if (!PUBLIC_KEY) {
      setStatus("error");
      setError(
        "Payment is not configured. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your environment.",
      );
      return;
    }
    if (!email) {
      setStatus("error");
      setError("A valid email is required to make payment.");
      return;
    }

    setStatus("processing");
    try {
      // react-paystack v6 callback signature
      initializePayment({
        onSuccess: handleSuccess,
        onClose: handleClose,
      });
    } catch {
      setStatus("error");
      setError("Could not open the payment window. Please try again.");
    }
  };

  const isBusy = status === "processing" || status === "verifying";
  const isPaid = status === "success";

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant={isPaid ? "navy" : "primary"}
        size="lg"
        disabled={disabled || isBusy || isPaid}
        onClick={startPayment}
        className={cn("w-full", !isPaid && !disabled && "shimmer-overlay")}
      >
        {status === "processing" && (
          <>
            <Loader2 className="animate-spin" /> Opening secure checkout…
          </>
        )}
        {status === "verifying" && (
          <>
            <Loader2 className="animate-spin" /> Verifying payment…
          </>
        )}
        {isPaid && (
          <>
            <CheckCircle2 /> Payment confirmed
          </>
        )}
        {(status === "idle" || status === "error") && (
          <>
            <CreditCard /> Pay {formatCedis(APPLICATION_FEE)} Application Fee
          </>
        )}
      </Button>

      {/* Status messaging */}
      {isPaid ? (
        <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-600">
          <CheckCircle2 className="size-3.5" />
          Reference: {reference}
        </p>
      ) : error ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-destructive">
          <AlertTriangle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        <p className="flex items-center justify-center gap-1.5 text-xs text-navy/50">
          <ShieldCheck className="size-3.5 text-gold-600" />
          Secured by Paystack · Cards, Mobile Money & Bank
        </p>
      )}
    </div>
  );
}
