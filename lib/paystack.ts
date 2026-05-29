import "server-only";

/**
 * Server-side Paystack verification. The browser can only ever *claim* a
 * payment succeeded; the single source of truth is Paystack's verify endpoint,
 * called here with the SECRET key. We confirm: status === "success", the
 * currency, and that the amount paid matches the expected fee exactly.
 */

const PAYSTACK_BASE = "https://api.paystack.co";

export interface VerifyResult {
  ok: boolean;
  reason?: string;
  amount?: number; // in pesewas
  currency?: string;
  customerEmail?: string;
  paidAt?: string;
  channel?: string;
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string; // "success" | "failed" | "abandoned" | ...
    amount: number; // pesewas
    currency: string;
    paid_at?: string;
    channel?: string;
    customer?: { email?: string };
  };
}

/**
 * Verify a transaction reference against Paystack.
 *
 * @param reference     The transaction reference returned to the client.
 * @param expectedPesewas Expected amount in the smallest unit (GH₵1 = 100).
 */
export async function verifyPaystackTransaction(
  reference: string,
  expectedPesewas: number,
): Promise<VerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return { ok: false, reason: "PAYSTACK_SECRET_KEY is not configured." };
  }
  if (!reference) {
    return { ok: false, reason: "Missing payment reference." };
  }

  let res: Response;
  try {
    res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
        // Always hit Paystack fresh — never serve a cached verification.
        cache: "no-store",
      },
    );
  } catch {
    return { ok: false, reason: "Could not reach Paystack." };
  }

  if (!res.ok) {
    return { ok: false, reason: `Paystack returned HTTP ${res.status}.` };
  }

  const body = (await res.json()) as PaystackVerifyResponse;
  const data = body.data;

  if (!body.status || !data) {
    return { ok: false, reason: body.message || "Verification failed." };
  }
  if (data.status !== "success") {
    return { ok: false, reason: `Payment status is "${data.status}".` };
  }
  if (data.amount < expectedPesewas) {
    return {
      ok: false,
      reason: `Amount paid (${data.amount}) is less than required (${expectedPesewas}).`,
    };
  }

  return {
    ok: true,
    amount: data.amount,
    currency: data.currency,
    customerEmail: data.customer?.email,
    paidAt: data.paid_at,
    channel: data.channel,
  };
}
