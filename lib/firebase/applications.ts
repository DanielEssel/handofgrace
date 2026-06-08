"use client";

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { getDb } from "@/lib/firebase/client";
import type {
  ApplicationRecord,
  ApplicationSubmission,
  RegistrationFormValues,
  UploadInput,
} from "@/types";

/** Read a File as base64 (without the data: prefix) for transport to the API. */
export function fileToUpload(field: string, file: File): Promise<UploadInput> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve({ field, name: file.name, type: file.type, dataBase64: base64 });
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

interface SubmitArgs {
  application: RegistrationFormValues;
  reference: string;
  uid?: string | null;
  uploads?: UploadInput[];
}

/** POST a verified application to the server. Throws with a readable message. */
export async function submitApplication(
  args: SubmitArgs,
): Promise<{ id: string; reference: string }> {
  const body: ApplicationSubmission = args;
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    id?: string;
    reference?: string;
    error?: string;
  };

  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? "Submission failed. Please try again.");
  }
  return { id: json.id ?? "", reference: json.reference ?? args.reference };
}

function toIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return null;
}

/**
 * Fetch applications belonging to a signed-in user, matched by email so that
 * applications made as a guest before signing up are still surfaced. The
 * Firestore rules permit reads only where the doc email equals the caller's.
 */
export async function fetchApplicationsByEmail(
  email: string,
): Promise<ApplicationRecord[]> {
  const db = getDb();
  const q = query(
    collection(db, "applications"),
    where("email", "==", email.toLowerCase()),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      uid: (data.uid as string | null) ?? null,
      status: data.status,
      reference: data.reference,
      paymentVerified: Boolean(data.paymentVerified),
      amountPesewas: data.amountPesewas ?? 0,
      currency: data.currency ?? "GHS",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      mobile: data.mobile ?? "",
      selectedCourse: data.selectedCourse ?? [],
      certificateType: data.certificateType ?? "",
      schedule: data.schedule ?? "",
      duration: data.duration ?? "",
      uploads: data.uploads ?? [],
      createdAt: toIso(data.createdAt),
      details: data.details,
    } as ApplicationRecord;
  });
}
