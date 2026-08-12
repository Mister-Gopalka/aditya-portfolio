// One place that talks to Resend.
//
// Both senders on this site — the contact alert and the admin sign-in code —
// need the same envelope, the same failure logging, and the same plain-text
// alternative. Duplicating that once was already one time too many.

const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
export const TO = process.env.CONTACT_TO_EMAIL || "mistergopalka@gmail.com";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Returns whether the mail actually went out. Callers decide what that means:
 * a failed contact alert is survivable because the message is already saved,
 * but a failed sign-in code would lock Aditya out, so that caller has to say
 * so on screen rather than leaving him staring at an empty code box.
 *
 * Never throws. Always logs, because a version of this that swallowed errors
 * once made a deployment with no RESEND_API_KEY look exactly like a working
 * one for weeks.
 */
export async function sendEmail(opts: {
  subject: string;
  text: string;
  html: string;
  /** Prefix for log lines, e.g. "contact" or "admin". */
  tag: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(`[${opts.tag}] RESEND_API_KEY is not set — no email sent`);
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: opts.subject,
      // HTML-only mail scores badly with spam filters, and one of these did
      // land in spam. A plain-text alternative is the cheapest fix available;
      // the real one is verifying a domain so this stops sending as resend.dev.
      text: opts.text,
      html: opts.html,
    }),
  }).catch((e) => {
    console.error(`[${opts.tag}] Resend request failed:`, e?.message ?? e);
    return null;
  });

  if (!res) return false;

  if (!res.ok) {
    console.error(`[${opts.tag}] Resend rejected the email: HTTP ${res.status} ${await res.text()}`);
    return false;
  }

  return true;
}
