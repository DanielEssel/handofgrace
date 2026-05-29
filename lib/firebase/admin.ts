import "server-only";

import {
  getApps,
  initializeApp,
  cert,
  getApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Server-side Firebase Admin. Uses a service account from environment
 * variables. The Admin SDK bypasses security rules, so all privileged writes
 * (saving applications, uploading files) run here — never from the browser.
 *
 * Never import this file from a Client Component. The `server-only` guard above
 * will throw at build time if that happens.
 */

export const isAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY,
);

function getAdminApp(): App {
  if (!isAdminConfigured) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
    );
  }
  if (getApps().length) return getApp();

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Vercel / .env store the key with literal "\n" — restore real newlines.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminBucket() {
  return getStorage(getAdminApp()).bucket();
}

/**
 * Verify a Firebase ID token from an Authorization: Bearer header and confirm
 * the caller has the `admin` custom claim. Returns the decoded token on
 * success, or null if missing/invalid/not-admin.
 */
export async function verifyAdmin(
  authHeader: string | null,
): Promise<{ uid: string; email?: string } | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const idToken = authHeader.slice("Bearer ".length).trim();
  if (!idToken) return null;

  try {
    const { getAuth } = await import("firebase-admin/auth");
    const decoded = await getAuth(getAdminApp()).verifyIdToken(idToken);
    if (decoded.admin !== true) return null;
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}
