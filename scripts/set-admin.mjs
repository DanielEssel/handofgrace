/**
 * Grant or revoke the `admin` custom claim on a Firebase user.
 *
 * Usage (from the project root, with your Admin env vars loaded):
 *   node scripts/set-admin.mjs admin@example.com           # grant admin
 *   node scripts/set-admin.mjs admin@example.com --revoke  # revoke admin
 *
 * The user must already exist (they should sign up through the site first).
 * After running, the user must sign out and back in for the claim to take
 * effect in their token.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

// Load .env.local manually (no dependency on dotenv).
try {
  const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
} catch {
  // .env.local not found — rely on already-exported env vars.
}

const email = process.argv[2];
const revoke = process.argv.includes("--revoke");

if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email> [--revoke]");
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { admin: !revoke });
  console.log(
    `${revoke ? "Revoked" : "Granted"} admin for ${email} (uid: ${user.uid}).`,
  );
  console.log("The user must sign out and back in for it to take effect.");
  process.exit(0);
} catch (err) {
  console.error("Failed:", err.message ?? err);
  process.exit(1);
}
