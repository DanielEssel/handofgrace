"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";
import type { ApplicationRecord, ApplicationStatus } from "@/types";

async function authHeader(): Promise<Record<string, string>> {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("You must be signed in.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

/** Fetch all applications (admin only). */
export async function fetchAllApplications(): Promise<ApplicationRecord[]> {
  const res = await fetch("/api/admin/applications", {
    headers: await authHeader(),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    applications?: ApplicationRecord[];
    error?: string;
  };
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? "Could not load applications.");
  }
  return json.applications ?? [];
}

/** Update one application's status (admin only). */
export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const res = await fetch("/api/admin/applications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ id, status }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
  };
  if (!res.ok || !json.ok) {
    throw new Error(json.error ?? "Could not update status.");
  }
}
