import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminDb, adminBucket, isAdminConfigured } from "@/lib/firebase/admin";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { registrationSchema } from "@/lib/validation";
import { APPLICATION_FEE } from "@/data/site";
import type {
  ApplicationSubmission,
  StoredUpload,
  UploadInput,
} from "@/types";

/** Never statically optimise — this route always runs on the server. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3 MB per file
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const FAR_FUTURE = new Date("2099-12-31").getTime();

function bad(reason: string, code = 400) {
  return NextResponse.json({ ok: false, error: reason }, { status: code });
}

async function storeUploads(
  reference: string,
  uploads: UploadInput[],
): Promise<StoredUpload[]> {
  const bucket = adminBucket();
  const stored: StoredUpload[] = [];

  for (const upload of uploads) {
    if (!ALLOWED_UPLOAD_TYPES.has(upload.type)) continue;

    const buffer = Buffer.from(upload.dataBase64, "base64");
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_UPLOAD_BYTES) continue;

    const safeName = upload.name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
    const path = `applications/${reference}/${upload.field}-${safeName}`;
    const file = bucket.file(path);

    await file.save(buffer, {
      contentType: upload.type,
      resumable: false,
      metadata: { cacheControl: "private, max-age=0" },
    });

    // Long-lived signed read URL (v2 signing supports far-future expiry).
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: FAR_FUTURE,
    });

    stored.push({
      field: upload.field,
      name: upload.name,
      type: upload.type,
      url,
      path,
    });
  }

  return stored;
}

export async function POST(req: Request) {
  if (!isAdminConfigured) {
    return bad(
      "Server is not configured for submissions yet. Add the Firebase Admin environment variables.",
      503,
    );
  }

  let payload: ApplicationSubmission;
  try {
    payload = (await req.json()) as ApplicationSubmission;
  } catch {
    return bad("Invalid request body.");
  }

  const { application, reference, uid, uploads } = payload;

  if (!reference) return bad("Missing payment reference.");

  // 1. Re-validate the form server-side — never trust the client's word.
  const parsed = registrationSchema.safeParse(application);
  if (!parsed.success) {
    return bad("Application data failed validation.");
  }
  const data = parsed.data;

  // 2. Guard against a replayed/duplicate reference.
  const existing = await adminDb()
    .collection("applications")
    .where("reference", "==", reference)
    .limit(1)
    .get();
  if (!existing.empty) {
    return bad("This payment reference has already been submitted.", 409);
  }

  // 3. Verify the payment with Paystack (secret key, server-side).
  const verification = await verifyPaystackTransaction(
    reference,
    APPLICATION_FEE * 100,
  );
  if (!verification.ok) {
    return bad(`Payment could not be verified: ${verification.reason}`, 402);
  }

  // 4. Upload any supporting files (server-side, via Admin SDK).
  let storedUploads: StoredUpload[] = [];
  try {
    if (uploads?.length) {
      storedUploads = await storeUploads(reference, uploads);
    }
  } catch {
    // Uploads are non-blocking; the application still records without them.
    storedUploads = [];
  }

  // 5. Persist the application.
  const doc = {
    uid: uid ?? null,
    status: "pending_review" as const,
    reference,
    paymentVerified: true,
    amountPesewas: verification.amount ?? APPLICATION_FEE * 100,
    currency: verification.currency ?? "GHS",
    paidAt: verification.paidAt ?? null,
    channel: verification.channel ?? null,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email.toLowerCase(),
    mobile: data.mobile,
    selectedCourse: data.selectedCourse,
    certificateType: data.certificateType,
    schedule: data.schedule,
    duration: data.duration,
    uploads: storedUploads,
    details: data,
    createdAt: FieldValue.serverTimestamp(),
  };

  const ref = await adminDb().collection("applications").add(doc);

  return NextResponse.json({ ok: true, id: ref.id, reference });
}
