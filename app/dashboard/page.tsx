"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogOut,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Inbox,
  Download,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchApplicationsByEmail } from "@/lib/firebase/applications";
import { downloadReceipt } from "@/lib/receipt";
import { COURSES } from "@/data/programs";
import { formatCedis } from "@/lib/utils";
import { SITE } from "@/data/site";
import type { ApplicationRecord, ApplicationStatus } from "@/types";

const COURSE_LABELS: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.id, c.label]),
);

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; cls: string; icon: typeof Clock }
> = {
  pending_review: {
    label: "Pending Review",
    cls: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    cls: "bg-sky-100 text-sky-700",
    icon: Search,
  },
  accepted: {
    label: "Accepted",
    cls: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Not Successful",
    cls: "bg-rose-100 text-rose-700",
    icon: XCircle,
  },
};

export default function DashboardPage() {
  const { user, loading, configured, logout } = useAuth();
  const [apps, setApps] = useState<ApplicationRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user?.email) return;
    setError(null);
    try {
      setApps(await fetchApplicationsByEmail(user.email));
    } catch {
      setError("Could not load your applications. Please try again.");
    }
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  return (
    <div className="min-h-screen bg-slatebg">
      {/* Top bar */}
      <header className="border-b border-navy/10 bg-white">
        <div className="container-x flex items-center justify-between py-3">
          <Link href="/" aria-label="Back to homepage">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft /> Home
              </Button>
            </Link>
            {user && (
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut /> Sign Out
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container-x py-10">
        <div className="mb-8">
          <p className="kicker text-gold-600">Applicant Portal</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-navy">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track the status of your registration with {SITE.shortName}.
          </p>
        </div>

        {/* Firebase not configured */}
        {!configured ? (
          <EmptyCard
            icon={Inbox}
            title="Portal not configured yet"
            body="The applicant portal becomes available once Firebase is connected."
          />
        ) : loading ? (
          <div className="flex items-center gap-2 text-sm text-navy/50">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </div>
        ) : !user ? (
          /* Signed out */
          <EmptyCard
            icon={FileText}
            title="Please sign in"
            body="Sign in to view the applications linked to your email address."
            action={
              <Button variant="primary" size="md" onClick={() => setAuthOpen(true)}>
                Sign In
              </Button>
            }
          />
        ) : error ? (
          <EmptyCard
            icon={XCircle}
            title="Something went wrong"
            body={error}
            action={
              <Button variant="outline" size="md" onClick={load}>
                Retry
              </Button>
            }
          />
        ) : apps === null ? (
          <div className="flex items-center gap-2 text-sm text-navy/50">
            <Loader2 className="size-4 animate-spin" /> Fetching your applications…
          </div>
        ) : apps.length === 0 ? (
          <EmptyCard
            icon={Inbox}
            title="No applications yet"
            body={`We found no applications for ${user.email}. If you applied as a guest, make sure you used this same email.`}
            action={
              <Link href="/#register">
                <Button variant="primary" size="md">
                  Start an Application
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {apps.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function ApplicationCard({ app }: { app: ApplicationRecord }) {
  const meta = STATUS_META[app.status] ?? STATUS_META.pending_review;
  const StatusIcon = meta.icon;
  const date = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-GH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-navy">
            {app.firstName} {app.lastName}
          </h2>
          <p className="text-xs text-navy/45">Submitted {date}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.cls}`}
        >
          <StatusIcon className="size-3.5" />
          {meta.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {app.selectedCourses.map((id) => (
          <span
            key={id}
            className="rounded-full bg-navy/5 px-3 py-1 text-xs font-medium text-navy/70"
          >
            {COURSE_LABELS[id] ?? id}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-navy/10 pt-4 text-sm sm:grid-cols-4">
        <Detail label="Certificate" value={cap(app.certificateType)} />
        <Detail label="Schedule" value={cap(app.schedule)} />
        <Detail label="Duration" value={app.duration.replace("-", " ")} />
        <Detail label="Fee Paid" value={formatCedis(app.amountPesewas / 100)} />
      </dl>

      <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="rounded-full bg-slatebg px-3 py-1.5 text-[11px] font-semibold text-navy/50">
          Ref: {app.reference}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadReceipt({
              application: app.details,
              reference: app.reference,
              amountPesewas: app.amountPesewas,
              status: app.status,
              createdAt: app.createdAt,
            })
          }
        >
          <Download className="size-4" /> Receipt
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy/40">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold text-navy">{value}</dd>
    </div>
  );
}

function EmptyCard({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof Inbox;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-navy/10 bg-white p-12 text-center shadow-soft">
      <span className="grid size-14 place-items-center rounded-2xl bg-navy/5 text-navy/40">
        <Icon className="size-7" />
      </span>
      <h2 className="mt-4 font-heading text-xl font-bold text-navy">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";
}
