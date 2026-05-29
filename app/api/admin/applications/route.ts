import { NextResponse } from "next/server";

import { adminDb, verifyAdmin, isAdminConfigured } from "@/lib/firebase/admin";
import type { ApplicationStatus } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_STATUSES: ApplicationStatus[] = [
  "pending_review",
  "under_review",
  "accepted",
  "rejected",
];

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Not authorized." },
    { status: 401 },
  );
}

/** GET /api/admin/applications — list all applications (newest first). */
export async function GET(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json(
      { ok: false, error: "Server not configured." },
      { status: 503 },
    );
  }

  const caller = await verifyAdmin(req.headers.get("authorization"));
  if (!caller) return unauthorized();

  const snap = await adminDb()
    .collection("applications")
    .orderBy("createdAt", "desc")
    .limit(500)
    .get();

  const applications = snap.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt?.toDate
      ? data.createdAt.toDate().toISOString()
      : null;
    return {
      id: d.id,
      uid: data.uid ?? null,
      status: data.status ?? "pending_review",
      reference: data.reference ?? "",
      paymentVerified: Boolean(data.paymentVerified),
      amountPesewas: data.amountPesewas ?? 0,
      currency: data.currency ?? "GHS",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      mobile: data.mobile ?? "",
      selectedCourses: data.selectedCourses ?? [],
      certificateType: data.certificateType ?? "",
      schedule: data.schedule ?? "",
      duration: data.duration ?? "",
      uploads: data.uploads ?? [],
      createdAt,
      details: data.details,
    };
  });

  return NextResponse.json({ ok: true, applications });
}

/** PATCH /api/admin/applications — update one application's status. */
export async function PATCH(req: Request) {
  if (!isAdminConfigured) {
    return NextResponse.json(
      { ok: false, error: "Server not configured." },
      { status: 503 },
    );
  }

  const caller = await verifyAdmin(req.headers.get("authorization"));
  if (!caller) return unauthorized();

  let body: { id?: string; status?: ApplicationStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { id, status } = body;
  if (!id || !status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "A valid application id and status are required." },
      { status: 400 },
    );
  }

  const ref = adminDb().collection("applications").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    return NextResponse.json(
      { ok: false, error: "Application not found." },
      { status: 404 },
    );
  }

  await ref.update({
    status,
    reviewedBy: caller.email ?? caller.uid,
    reviewedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, id, status });
}
