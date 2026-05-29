"use client";

import { jsPDF } from "jspdf";
import { SITE, APPLICATION_FEE } from "@/data/site";
import { COURSES } from "@/data/programs";
import type { RegistrationFormValues } from "@/types";

const COURSE_LABELS: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.id, c.label]),
);

const NAVY = "#0B1F3A";
const GOLD = "#D4AF37";
const INK = "#1E293B";
const MUTE = "#64748B";

interface ReceiptData {
  application: RegistrationFormValues;
  reference: string;
  amountPesewas?: number;
  status?: string;
  createdAt?: string | null;
}

function cedis(n: number) {
  return `GH\u20B5 ${n.toLocaleString("en-GH")}`;
}

function cap(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

/**
 * Build the application receipt PDF. Returns the jsPDF doc so callers can
 * either .save() it (download) or open it.
 */
export function buildReceipt(data: ReceiptData): jsPDF {
  const { application: a, reference } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 0;

  // ── Header band ──
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(GOLD);
  doc.rect(0, 110, pageW, 4, "F");

  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(SITE.name, margin, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor("#C9D2E0");
  doc.text(SITE.location, margin, 68);
  doc.text(`${SITE.phone}  ·  ${SITE.email}`, margin, 84);

  // Title chip on the right
  doc.setTextColor(GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("APPLICATION RECEIPT", pageW - margin, 50, { align: "right" });

  y = 150;

  // ── Reference + meta box ──
  doc.setDrawColor("#E2E8F0");
  doc.setFillColor("#F8FAFC");
  doc.roundedRect(margin, y, pageW - margin * 2, 64, 8, 8, "FD");

  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.setFont("helvetica", "bold");
  doc.text("PAYMENT REFERENCE", margin + 16, y + 22);
  doc.text("DATE", pageW - margin - 150, y + 22);

  doc.setFontSize(12);
  doc.setTextColor(INK);
  doc.text(reference, margin + 16, y + 44);
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-GH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  doc.text(dateStr, pageW - margin - 150, y + 44);

  y += 96;

  // ── Section helper ──
  const sectionTitle = (label: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(NAVY);
    doc.text(label.toUpperCase(), margin, y);
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1.5);
    doc.line(margin, y + 6, margin + 28, y + 6);
    y += 22;
  };

  const row = (label: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(MUTE);
    doc.text(label, margin, y);
    doc.setFontSize(10);
    doc.setTextColor(INK);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(value || "—", pageW - margin * 2 - 160);
    doc.text(lines, margin + 160, y);
    y += 16 * lines.length + 4;
  };

  // ── Applicant ──
  sectionTitle("Applicant");
  row("Full Name", `${a.firstName} ${a.lastName}`);
  row("Email", a.email);
  row("Mobile", a.mobile);
  row("Date of Birth", a.dateOfBirth);
  row("Gender", cap(a.gender));
  row("Address", `${a.address}, ${a.town}`);
  y += 8;

  // ── Programme ──
  sectionTitle("Programme");
  const courseNames = (a.selectedCourses ?? [])
    .map((id) => COURSE_LABELS[id] ?? id)
    .join(", ");
  row("Courses", courseNames || "—");
  row("Certificate", cap(a.certificateType));
  row("Schedule", cap(a.schedule));
  row("Duration", cap(a.duration));
  y += 8;

  // ── Payment ──
  sectionTitle("Payment");
  const amount = (data.amountPesewas ?? APPLICATION_FEE * 100) / 100;
  row("Application Fee", cedis(amount));
  row("Status", "Paid · Verified");
  row(
    "Application Status",
    cap(data.status ?? "pending_review").replace("_", " "),
  );

  // ── Footer ──
  const footY = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor("#E2E8F0");
  doc.setLineWidth(0.5);
  doc.line(margin, footY, pageW - margin, footY);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.text(`"${SITE.motto}"`, margin, footY + 18);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This receipt confirms your application and fee payment. Keep it for your records.",
    margin,
    footY + 32,
  );

  return doc;
}

/** Generate and download the receipt PDF. */
export function downloadReceipt(data: ReceiptData) {
  const doc = buildReceipt(data);
  const safeRef = data.reference.replace(/[^\w-]+/g, "");
  doc.save(`HandOfGrace-Application-${safeRef}.pdf`);
}
