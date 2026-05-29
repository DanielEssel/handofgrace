# Admin Setup — Approving Applications

The site has a secure admin panel at **`/admin`** where staff review applications
and set their status (Pending → Under Review → Accepted / Rejected). Applicants
see the status update on their own dashboard.

Admin access uses **Firebase custom claims** — the same login as everyone else,
but specific accounts are flagged as admin. There is no separate password to
manage or leak.

## Making someone an admin

1. The person must first **sign up on the site** (so the account exists), using
   the email you want to grant admin to.

2. From the project root, with your `.env.local` filled in (the Admin SDK vars),
   run:

   ```bash
   node scripts/set-admin.mjs their-email@example.com
   ```

   You should see: `Granted admin for their-email@example.com`.

3. That person must **sign out and sign back in** — the admin flag is baked into
   their login token, so it only refreshes on a new sign-in.

4. They'll now see an **Admin Panel** link in their account menu, and `/admin`
   will load. Everyone else is blocked (the link is hidden and the page denies
   access).

## Removing admin

```bash
node scripts/set-admin.mjs their-email@example.com --revoke
```

(Again, they must sign out/in for it to take effect.)

## How it stays secure

- The `/admin` page checks the admin claim before rendering anything.
- The admin **API route** (`/api/admin/applications`) independently verifies the
  caller's Firebase ID token *and* the admin claim on the server for every
  request — so even a crafted request from a non-admin is rejected.
- Firestore rules allow admins to read all applications, but **all writes**
  (including status changes) go through the server-side Admin SDK only; the
  browser can never write directly.

## What admins can do

- See every application with totals (pending / accepted / rejected)
- Filter by status and search by name, email, or reference
- Expand an application to see full details, courses, and any uploaded files
- Set status to Under Review, Accepted, or Rejected
- Download any applicant's PDF receipt
