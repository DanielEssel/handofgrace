# Backend Setup — Paystack & Firebase

This site ships with a real, production-shaped backend:

- **Server-side Paystack verification** (no trusting the browser)
- **Firestore** for storing applications
- **Firebase Storage** for applicant uploads (photo + certificate)
- **Firebase Auth** (email/password) so applicants can track their status

Everything privileged runs on the server in `app/api/applications/route.ts`
using the Firebase Admin SDK. The browser never writes to the database or
storage directly.

---

## 1. Environment variables

Copy `.env.example` to `.env.local` and fill in every value.

```bash
cp .env.example .env.local
```

| Variable | Where it's used | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Browser — opens checkout | No |
| `PAYSTACK_SECRET_KEY` | Server — verifies payments | **Yes** |
| `NEXT_PUBLIC_FIREBASE_*` | Browser — Auth + reads | No |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Server — Admin SDK | **Yes** |
| `FIREBASE_STORAGE_BUCKET` | Server — uploads | No |

> The `NEXT_PUBLIC_*` Firebase values are **not** secrets — they identify your
> project. Access is controlled by the security rules, not by hiding them.

### Pasting the Admin private key

Firebase gives you a JSON service-account file. Copy the `private_key` value —
including its `\n` escapes — and wrap it in double quotes on one line:

```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

The code converts the `\n` back into real newlines at runtime.

---

## 2. Firebase project setup

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Sign-in method →** enable **Email/Password**.
3. **Firestore Database →** create a database (production mode).
4. **Storage →** enable it (default bucket is fine).
5. **Project settings → General → Your apps →** register a Web app and copy the
   config into the `NEXT_PUBLIC_FIREBASE_*` variables.
6. **Project settings → Service accounts → Generate new private key →** use that
   JSON for the three server-side `FIREBASE_*` variables.

### Deploy the security rules

The repo includes `firestore.rules`, `storage.rules`, and `firebase.json`.

```bash
npm i -g firebase-tools
firebase login
firebase use --add        # select your project
firebase deploy --only firestore:rules,storage:rules
```

The rules lock everything down: applicants can read **only** applications whose
email matches their signed-in account, and **all** writes happen server-side via
the Admin SDK (which bypasses rules). Storage is fully closed to clients —
uploads are written by the server and served through signed URLs.

---

## 3. Paystack setup

1. Create an account at <https://dashboard.paystack.com>.
2. **Settings → API Keys & Webhooks →** copy your **public** and **secret**
   keys (use test keys first).
3. Put them in `.env.local` as shown above.

The flow:

1. Applicant completes the form → clicks **Pay GH₵100**.
2. Paystack popup handles the actual payment.
3. On success, the browser POSTs the form + reference to `/api/applications`.
4. The server **re-verifies** the reference against Paystack's `verify` endpoint
   with the secret key, confirms the amount and `success` status, then saves.
5. A duplicate/replayed reference is rejected (409).

This means a spoofed client "success" can never create a paid application —
the server is the source of truth.

> **Go-live:** switch to live keys, and consider adding a Paystack **webhook**
> (`charge.success`) as a second confirmation path for resilience.

---

## 4. Data model

Applications are stored in the `applications` collection:

| Field | Notes |
| --- | --- |
| `status` | `pending_review` → `under_review` → `accepted` / `rejected` |
| `reference` | Paystack reference (unique) |
| `paymentVerified`, `amountPesewas`, `currency` | From server verification |
| `email` (lowercased) | Used by Auth rules + dashboard lookup |
| `selectedCourses`, `certificateType`, `schedule`, `duration` | Summary fields |
| `uploads[]` | `{ field, name, type, url, path }` signed-URL refs |
| `details` | Full original form payload |
| `createdAt` | Server timestamp |

Staff can change `status` from the Firebase console; the applicant dashboard
reflects it automatically.

---

## 5. Running without the backend

The site degrades gracefully. If Firebase isn't configured, the Sign In control
and dashboard hide themselves, and the API route returns a clear 503. The
marketing pages and form UI still work for previews.
