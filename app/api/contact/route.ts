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

/**
 * Sends the alert. Never throws: the submission is already saved, and a
 * failed email must not fail the request.
 *
 * It does, however, log loudly. The first version swallowed every error, so a
 * deployment missing RESEND_API_KEY looked exactly like a working one — the
 * message saved, the form said thanks, and no alert was ever sent. These lines
 * are what make that visible in the Vercel logs.
 */
async function sendEmail(sub: { name: string; phone: string; requirement: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set — message saved, no alert sent");
    return;
  }

  const whatsapp = `https://wa.me/${sub.phone.replace(/\D/g, "")}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `New enquiry from ${sub.name}`,
      // HTML-only mail scores badly with spam filters. A plain-text
      // alternative is the cheapest deliverability win available; the real
      // one is verifying a domain so this stops sending as resend.dev.
      text: [
        `New message from adityagopalka.com`,
        ``,
        `Name:  ${sub.name}`,
        `Phone: ${sub.phone}`,
        `WhatsApp: ${whatsapp}`,
        ``,
        sub.requirement,
        ``,
        `Open the inbox: https://www.adityagopalka.com/admin`,
      ].join("\n"),
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
  }).catch((e) => {
    console.error("[contact] Resend request failed:", e?.message ?? e);
    return null;
  });

  if (res && !res.ok) {
    console.error(
      `[contact] Resend rejected the email: HTTP ${res.status} ${await res.text()}`
    );
  }
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
