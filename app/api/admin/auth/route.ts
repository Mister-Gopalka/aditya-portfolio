import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/admin-auth";
import {
  DEVICE_COOKIE,
  MASKED_RECIPIENT,
  createLoginCode,
  getActiveDevice,
  readCookie,
  requestContext,
  sendLoginCodeEmail,
  touchDevice,
  verifyDeviceToken,
} from "@/lib/admin-devices";

// Step one of signing in.
//
// Correct password on a device this site already trusts: straight in. Correct
// password on anything else: no session, just an emailed code, which doubles
// as the alarm that someone knows the password. Step two is ./verify.

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: null }));

  // The password is still the first gate. Everything below only runs once it
  // is right, so a wrong guess cannot make this site send email.
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set" }, { status: 500 });
  }

  const ctx = requestContext(req);
  const deviceId = await verifyDeviceToken(readCookie(req, DEVICE_COOKIE));
  const device = deviceId ? await getActiveDevice(deviceId) : null;

  if (device) {
    await touchDevice(device.id, ctx);
    const res = NextResponse.json({ ok: true, device: device.name });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true, // unreadable from JS, so a script on the page cannot lift it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  }

  const code = await createLoginCode(ctx);
  if (!code) {
    return NextResponse.json(
      { error: "Could not start verification. Check SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  // Whether the mail actually left matters here in a way it does not for the
  // contact form: if it silently failed, Aditya would sit in front of an empty
  // code box with no way in. The client says so, and points at the fallback.
  const sent = await sendLoginCodeEmail(code, ctx);

  return NextResponse.json({ needsVerification: true, sent, sentTo: MASKED_RECIPIENT });
}

/** Sign out. Only the session goes — the device stays trusted. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
