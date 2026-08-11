import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/inbox";

// The form used to insert straight from the browser with the public key. It
// runs here now so the email can fire on the same request, and so the browser
// no longer writes to the database at all.

const TO = process.env.CONTACT_TO_EMAIL || "mistergopalka@gmail.com";
// Resend's shared sender works without a verified domain, but only delivers to
// the address that owns the Resend account. That is exactly this case. Set
// CONTACT_FROM_EMAIL once a domain is verified.
const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

const LIMITS = { name: 120, phone: 40, requirement: 2000 };

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(sub: { name: string; phone: string; requirement: string }) {
  const key = process.env.RESEND_API_KEY;
  // No key yet means no alert. The submission is already saved either way —
  // a missing key must never cost you the message.
  if (!key) return;

  const whatsapp = `https://wa.me/${sub.phone.replace(/\D/g, "")}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `New enquiry from ${sub.name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1C0A00">
          <p style="margin:0 0 18px;font-size:13px;color:#8a7f78">New message from adityagopalka.com</p>
          <p style="margin:0 0 6px"><strong>${escapeHtml(sub.name)}</strong></p>
          <p style="margin:0 0 18px"><a href="${whatsapp}" style="color:#A0281A">${escapeHtml(sub.phone)}</a></p>
          <p style="margin:0 0 24px;padding:14px 16px;background:#FFF8F3;border-radius:8px">${escapeHtml(sub.requirement)}</p>
          <p style="margin:0"><a href="https://www.adityagopalka.com/admin" style="color:#A0281A">Open the inbox</a></p>
        </div>
      `,
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const submission = {
    name: clean(body.name, LIMITS.name),
    phone: clean(body.phone, LIMITS.phone),
    requirement: clean(body.requirement, LIMITS.requirement),
  };

  if (!submission.name || !submission.phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  try {
    await createSubmission(submission);
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  // Saving is what matters; a failed email must not fail the request.
  await sendEmail(submission);

  return NextResponse.json({ ok: true });
}
