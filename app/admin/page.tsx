"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LogOut,
  Loader2,
  ShieldX,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  fetchAllApplications,
  updateApplicationStatus,
} from "@/lib/firebase/admin-client";
import { downloadReceipt } from "@/lib/receipt";
import { COURSES } from "@/data/programs";
import { formatCedis } from "@/lib/utils";
import type { ApplicationRecord, ApplicationStatus } from "@/types";

const COURSE_LABELS: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.id, c.label]),
);

const STATUS_META: Record<
  ApplicationStatus,
  { label: string; cls: string }
> = {
  pending_review: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  under_review: { label: "Under Review", cls: "bg-sky-100 text-sky-700" },
  accepted: { label: "Accepted", cls: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", cls: "bg-rose-100 text-rose-700" },
};

const FILTERS: { key: ApplicationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending_review", label: "Pending" },
  { key: "under_review", label: "Under Review" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminPage() {
  const { user, loading, configured, isAdmin, logout } = useAuth();
  const [apps, setApps] = useState<ApplicationRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setApps(await fetchAllApplications());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load applications.");
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) load();
  }, [user, isAdmin, load]);

  const onSetStatus = async (id: string, status: ApplicationStatus) => {
    setBusyId(id);
    try {
      await updateApplicationStatus(id, status);
      setApps((prev) =>
        prev ? prev.map((a) => (a.id === id ? { ...a, status } : a)) : prev,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    if (!apps) return [];
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.reference.toLowerCase().includes(q)
      );
    });
  }, [apps, filter, search]);

  const counts = useMemo(() => {
    const c = { total: 0, pending_review: 0, accepted: 0, rejected: 0 };
    apps?.forEach((a) => {
      c.total++;
      if (a.status === "pending_review") c.pending_review++;
      if (a.status === "accepted") c.accepted++;
      if (a.status === "rejected") c.rejected++;
    });
    return c;
  }, [apps]);

  /* ---- Access gating ---- */
  if (!configured) {
    return <Centered title="Admin unavailable" body="Firebase isn't configured." />;
  }
  if (loading) {
    return <Centered spinner body="Checking access…" />;
  }
  if (!user) {
    return (
      <>
        <Centered
          title="Admin sign in"
          body="Sign in with an administrator account to continue."
          action={
            <Button variant="primary" size="md" onClick={() => setAuthOpen(true)}>
              Sign In
            </Button>
          }
        />
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </>
    );
  }
  if (!isAdmin) {
    return (
      <Centered
        icon={<ShieldX className="size-7" />}
        title="Access denied"
        body="This account doesn't have administrator privileges."
        action={
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="md">
                Home
              </Button>
            </Link>
            <Button variant="ghost" size="md" onClick={() => logout()}>
              Sign out
            </Button>
          </div>
        }
      />
    );
  }

  /* ---- Admin view ---- */
  return (
    <div className="min-h-screen bg-slatebg">
      <header className="border-b border-navy/10 bg-white">
        <div className="container-x flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
            <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-300">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft /> Site
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-x py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-navy">
            Applications
          </h1>
          <p className="text-sm text-slate-500">
            Review and update applicant statuses.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Total" value={counts.total} />
          <Stat label="Pending" value={counts.pending_review} accent="amber" />
          <Stat label="Accepted" value={counts.accepted} accent="emerald" />
          <Stat label="Rejected" value={counts.rejected} accent="rose" />
        </div>

        {/* Controls */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.key
                    ? "bg-navy text-white"
                    : "bg-white text-navy/60 hover:bg-navy/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, ref…"
              className="h-10 w-full rounded-xl border border-navy/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-gold/60 sm:w-64"
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {error}{" "}
            <button onClick={load} className="underline">
              Retry
            </button>
          </p>
        )}

        {apps === null ? (
          <div className="flex items-center gap-2 text-sm text-navy/50">
            <Loader2 className="size-4 animate-spin" /> Loading applications…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-navy/10 bg-white p-12 text-center text-sm text-slate-500">
            No applications match this view.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <AdminRow
                key={app.id}
                app={app}
                busy={busyId === app.id}
                onSetStatus={onSetStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AdminRow({
  app,
  busy,
  onSetStatus,
}: {
  app: ApplicationRecord;
  busy: boolean;
  onSetStatus: (id: string, status: ApplicationStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[app.status] ?? STATUS_META.pending_review;
  const date = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-GH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="rounded-2xl border border-navy/10 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-sm font-bold text-gold-300">
            {app.firstName.charAt(0)}
            {app.lastName.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy">
              {app.firstName} {app.lastName}
            </p>
            <p className="truncate text-xs text-navy/50">
              {app.email} · {date}
            </p>
          </div>
        </button>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
        >
          {meta.label}
        </span>
      </div>

      {open && (
        <div className="border-t border-navy/10 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <DetailLine icon={Mail} value={app.email} />
              <DetailLine icon={Phone} value={app.mobile} />
              <DetailLine
                icon={FileText}
                value={`${app.certificateType} · ${app.schedule} · ${app.duration.replace("-", " ")}`}
              />
              <p className="text-xs text-navy/50">Ref: {app.reference}</p>
              <p className="text-xs text-navy/50">
                Fee: {formatCedis(app.amountPesewas / 100)}{" "}
                {app.paymentVerified && "· Verified"}
              </p>
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy/40">
                Courses
              </p>
              <div className="flex flex-wrap gap-1.5">
                {app.selectedCourse && (
                  <span
                    key={app.selectedCourse}
                    className="rounded-full bg-navy/5 px-2.5 py-1 text-xs font-medium text-navy/70"
                  >
                    {COURSE_LABELS[app.selectedCourse] ?? app.selectedCourse}
                  </span>
                )}
              </div>
          
              {app.uploads?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy/40">
                    Uploads
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.uploads.map((u) => (
                      <a
                        key={u.path}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-navy/10 px-2.5 py-1 text-xs font-medium text-gold-700 hover:bg-slatebg"
                      >
                        {u.field}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy/10 pt-4">
            <Button
              variant="navy"
              size="sm"
              disabled={busy || app.status === "under_review"}
              onClick={() => onSetStatus(app.id, "under_review")}
            >
              {busy ? <Loader2 className="animate-spin" /> : <Clock />}
              Mark Reviewing
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={busy || app.status === "accepted"}
              onClick={() => onSetStatus(app.id, "accepted")}
            >
              <CheckCircle2 /> Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy || app.status === "rejected"}
              onClick={() => onSetStatus(app.id, "rejected")}
            >
              <XCircle /> Reject
            </Button>
            <Button
              variant="ghost"
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
              <Download /> Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailLine({
  icon: Icon,
  value,
}: {
  icon: typeof Mail;
  value: string;
}) {
  return (
    <p className="flex items-center gap-2 text-navy/70">
      <Icon className="size-4 shrink-0 text-navy/35" />
      {value}
    </p>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber" | "emerald" | "rose";
}) {
  const accentCls =
    accent === "amber"
      ? "text-amber-600"
      : accent === "emerald"
        ? "text-emerald-600"
        : accent === "rose"
          ? "text-rose-600"
          : "text-navy";
  return (
    <div className="rounded-2xl border border-navy/10 bg-white p-4 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/40">
        {label}
      </p>
      <p className={`mt-1 font-heading text-2xl font-bold ${accentCls}`}>
        {value}
      </p>
    </div>
  );
}

function Centered({
  title,
  body,
  action,
  icon,
  spinner,
}: {
  title?: string;
  body: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  spinner?: boolean;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-slatebg p-6">
      <div className="flex max-w-sm flex-col items-center rounded-3xl border border-navy/10 bg-white p-10 text-center shadow-soft">
        {spinner ? (
          <Loader2 className="size-7 animate-spin text-navy/40" />
        ) : (
          <span className="grid size-14 place-items-center rounded-2xl bg-navy/5 text-navy/40">
            {icon ?? <ShieldX className="size-7" />}
          </span>
        )}
        {title && (
          <h1 className="mt-4 font-heading text-xl font-bold text-navy">
            {title}
          </h1>
        )}
        <p className="mt-1 text-sm text-slate-500">{body}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
