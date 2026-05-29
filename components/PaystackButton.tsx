"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaystackButtonProps } from "@/components/PaystackButton.impl";

/**
 * `react-paystack` touches `window` at import time, which breaks server
 * prerendering. We load the real implementation client-side only (ssr: false)
 * and show a disabled placeholder button during hydration.
 */
const PaystackButtonImpl = dynamic(
  () => import("@/components/PaystackButton.impl").then((m) => m.PaystackButtonImpl),
  {
    ssr: false,
    loading: () => (
      <Button variant="primary" size="lg" disabled className="w-full">
        <Loader2 className="animate-spin" /> Loading secure checkout…
      </Button>
    ),
  },
);

export function PaystackButton(props: PaystackButtonProps) {
  return <PaystackButtonImpl {...props} />;
}
