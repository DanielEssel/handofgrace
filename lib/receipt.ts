"use client";

import { jsPDF } from "jspdf";
import { SITE, APPLICATION_FEE } from "@/data/site";
import { COURSES } from "@/data/programs";
import type { RegistrationFormValues } from "@/types";

const COURSE_LABELS: Record<string, string> = Object.fromEntries(
  COURSES.map((c) => [c.id, c.label]),
);

/* Brand palette */
const NAVY = "#0B1F3A";
const GOLD = "#D4AF37";
const INK = "#1E293B";
const MUTE = "#64748B";
const LINE = "#E2E8F0";

/* Embedded font that contains the cedi glyph (₵). Served from /public/fonts. */
const FONT = "DejaVuSans";
const FONT_FILES = {
  normal: "/fonts/DejaVuSans.ttf",
  bold: "/fonts/DejaVuSans-Bold.ttf",
};

const LEVEL_LABELS: Record<string, string> = {
  basic: "Basic",
  jhs: "Junior High School",
  shs: "Senior High School",
  tertiary: "Tertiary",
};
const DURATION_LABELS: Record<string, string> = {
  "3-months": "3 Months",
  "2.5-years": "2.5 Years",
};

interface ReceiptData {
  application: RegistrationFormValues;
  reference: string;
  amountPesewas?: number;
  status?: string;
  createdAt?: string | null;
}

/** ₵ now renders because we embed a Unicode font below. */
function money(n: number) {
  return `\u20B5${n.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;
}

function cap(s?: string) {
  if (!s) return "—";
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

function formatDate(iso?: string | null) {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Fetch a binary file from /public and return base64 (no data prefix). */
async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  } catch {
    return null;
  }
}

/** Load an image path into a base64 data URL (browser only). */
function loadImage(
  src: string,
): Promise<{ data: string; w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve({
          data: canvas.toDataURL("image/png"),
          w: img.naturalWidth,
          h: img.naturalHeight,
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Register the embedded font on the doc. Returns the font family name to use,
 * falling back to Helvetica if the files can't be loaded (so ₵ degrades to a
 * box rather than crashing — but normally the font loads fine).
 */
async function registerFont(doc: jsPDF): Promise<string> {
  const [normal, bold] = await Promise.all([
    fetchAsBase64(FONT_FILES.normal),
    fetchAsBase64(FONT_FILES.bold),
  ]);
  if (!normal) return "helvetica";

  doc.addFileToVFS("DejaVuSans.ttf", normal);
  doc.addFont("DejaVuSans.ttf", FONT, "normal");

  if (bold) {
    doc.addFileToVFS("DejaVuSans-Bold.ttf", bold);
    doc.addFont("DejaVuSans-Bold.ttf", FONT, "bold");
  }
  return FONT;
}

/** Build the application receipt PDF (async: loads logo + fonts). */
export async function buildReceipt(data: ReceiptData): Promise<jsPDF> {
  const { application: a, reference } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = 0;

  // Register the Unicode font (or fall back to helvetica).
  const FF = await registerFont(doc);
  // If bold wasn't embedded, map "bold" requests to normal safely.
  const bold = (): void => {
    try {
      doc.setFont(FF, "bold");
    } catch {
      doc.setFont(FF, "normal");
    }
  };
  const normal = (): void => {
    doc.setFont(FF, "normal");
  };
  const italic = (): void => {
    // DejaVu italic isn't embedded; fall back to normal for that family.
    try {
      doc.setFont(FF, "italic");
    } catch {
      doc.setFont(FF, "normal");
    }
  };

  /* ── Header band ── */
  const HEADER_H = 116;
  doc.setFillColor(NAVY);
  doc.rect(0, 0, pageW, HEADER_H, "F");
  doc.setFillColor(GOLD);
  doc.rect(0, HEADER_H, pageW, 4, "F");

  const logo = await loadImage("/logo.png");
  let textX = margin;
  if (logo) {
    const cappedW = 64;
    const cappedH = (logo.h / logo.w) * cappedW;
    doc.addImage(logo.data, "PNG", margin, 28, cappedW, cappedH);
    textX = margin + cappedW + 16;
  }

  doc.setTextColor("#FFFFFF");
  bold();
  doc.setFontSize(15);
  doc.text(SITE.name, textX, 46, { maxWidth: pageW - textX - margin - 110 });

  normal();
  doc.setFontSize(9);
  doc.setTextColor("#C9D2E0");
  doc.text(
    SITE.locations.map((l) => l.address.replace(", Ghana", "")).join("  |  "),
    textX,
    72,
  );
  doc.text(`${SITE.phones[0].display}  ·  ${SITE.email}`, textX, 86);

  doc.setTextColor(GOLD);
  bold();
  doc.setFontSize(11);
  doc.text("APPLICATION RECEIPT", pageW - margin, 44, { align: "right" });

  y = HEADER_H + 36;

  /* ── Reference + date box ── */
  doc.setDrawColor(LINE);
  doc.setFillColor("#F8FAFC");
  doc.roundedRect(margin, y, pageW - margin * 2, 60, 8, 8, "FD");
  bold();
  doc.setFontSize(8);
  doc.setTextColor(MUTE);
  doc.text("PAYMENT REFERENCE", margin + 16, y + 20);
  doc.text("DATE ISSUED", pageW - margin - 170, y + 20);
  normal();
  doc.setFontSize(12);
  doc.setTextColor(INK);
  doc.text(reference, margin + 16, y + 42);
  doc.text(formatDate(data.createdAt), pageW - margin - 170, y + 42);
  y += 92;

  /* ── Helpers ── */
  const sectionTitle = (label: string) => {
    if (y > pageH - 120) {
      doc.addPage();
      y = margin;
    }
    bold();
    doc.setFontSize(11);
    doc.setTextColor(NAVY);
    doc.text(label.toUpperCase(), margin, y);
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1.5);
    doc.line(margin, y + 6, margin + 30, y + 6);
    y += 22;
  };

  const row = (label: string, value: string) => {
    if (y > pageH - 90) {
      doc.addPage();
      y = margin;
    }
    normal();
    doc.setFontSize(9);
    doc.setTextColor(MUTE);
    doc.text(label, margin, y);
    bold();
    doc.setFontSize(10);
    doc.setTextColor(INK);
    const lines = doc.splitTextToSize(value || "—", pageW - margin * 2 - 170);
    doc.text(lines, margin + 170, y);
    y += 15 * lines.length + 6;
  };

  /* ── Applicant ── */
  sectionTitle("Applicant Details");
  row("Full Name", `${a.firstName} ${a.lastName}`);
  row("Email", a.email);
  row("Mobile", a.mobile);
  row("Date of Birth", a.dateOfBirth);
  row("Gender", cap(a.gender));
  row("Languages Spoken", a.languages);
  row("Residential Address", `${a.address}, ${a.town}`);
  y += 6;

  /* ── Education ── */
  sectionTitle("Educational Background");
  row("Highest Level", LEVEL_LABELS[a.level] ?? cap(a.level));
  row("Institution", a.institution);
  row("Years Attended", `${a.fromYear} - ${a.toYear}`);
  y += 6;

 /* ── Programme ── */
sectionTitle("Programme & Preferences");
const courseName = COURSE_LABELS[a.selectedCourse] ?? a.selectedCourse ?? "—";
row("Selected Course", courseName);
row("Certificate Type", cap(a.certificateType));
row("Schedule", cap(a.schedule));
row("Duration", DURATION_LABELS[a.duration] ?? cap(a.duration));
y += 6;

  /* ── Guarantor ── */
  sectionTitle("Guarantor");
  row("Guarantor Name", a.guarantorName);
  row("Guarantor Contact", a.guarantorContact);
  row("Agreement", a.guarantorAgreement ? "Agreed" : "Not agreed");
  y += 6;

  /* ── Declaration ── */
  sectionTitle("Declaration");
  row("Accepted Terms", a.acceptTerms ? "Yes" : "No");
  row("Acknowledged Fees", a.acceptFees ? "Yes" : "No");
  row("Accepted Conduct Policy", a.acceptMisconduct ? "Yes" : "No");
  row("Signature", a.signature);
  y += 6;

  /* ── Payment (highlighted) ── */
  sectionTitle("Payment");
  if (y > pageH - 110) {
    doc.addPage();
    y = margin;
  }
  const amount = (data.amountPesewas ?? APPLICATION_FEE * 100) / 100;
  doc.setFillColor("#FBF7EA");
  doc.setDrawColor(GOLD);
  doc.roundedRect(margin, y, pageW - margin * 2, 56, 8, 8, "FD");
  normal();
  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.text("APPLICATION FEE", margin + 16, y + 22);
  bold();
  doc.setFontSize(16);
  doc.setTextColor(NAVY);
  doc.text(money(amount), margin + 16, y + 44);
  bold();
  doc.setFontSize(9);
  doc.setTextColor("#15803D");
  doc.text("PAID · VERIFIED", pageW - margin - 16, y + 22, { align: "right" });
  normal();
  doc.setFontSize(9);
  doc.setTextColor(MUTE);
  doc.text(
    `Status: ${cap((data.status ?? "pending_review").replace("_", " "))}`,
    pageW - margin - 16,
    y + 44,
    { align: "right" },
  );
  y += 56;

  /* ── Footer on every page ── */
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const footY = pageH - 54;
    doc.setDrawColor(LINE);
    doc.setLineWidth(0.5);
    doc.line(margin, footY, pageW - margin, footY);
    italic();
    doc.setFontSize(8.5);
    doc.setTextColor(MUTE);
    doc.text(`"${SITE.motto}"`, margin, footY + 16);
    normal();
    doc.text(
      "This receipt confirms your application and fee payment. Please keep it for your records.",
      margin,
      footY + 30,
    );
    doc.text(`Page ${p} of ${pageCount}`, pageW - margin, footY + 30, {
      align: "right",
    });
  }

  return doc;
}

/** Generate and download the receipt PDF. */
export async function downloadReceipt(data: ReceiptData) {
  const doc = await buildReceipt(data);
  const safeRef = data.reference.replace(/[^\w-]+/g, "");
  doc.save(`HandOfGrace-Application-${safeRef}.pdf`);
}