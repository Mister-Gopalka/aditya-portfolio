import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/admin-auth";
import {
  DEVICE_COOKIE,
  DEVICE_MAX_AGE,
  describeDevice,
  registerDevice,
  requestContext,
  signDeviceId,
  verifyLoginCode,
} from "@/lib/admin-devices";

// Step two: the emailed code. On success this device is remembered, so the
// code is a one-time cost per device rather than per sign-in.

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // The password is rechecked here rather than trusted from step one.
  // Without it this route would be an independent way in for anyone who got
  // hold of a code, and the code travels by email.
  if (!checkPassword(body.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await verifyLoginCode(body.code))) {
    return NextResponse.json(
      { error: "That code is wrong or has expired." },
      { status: 400 }
    );
  }

  const ctx = requestContext(req);
  const name = typeof body.name === "string" ? body.name : "";

  const deviceId = await registerDevice(name || describeDevice(ctx.userAgent), ctx);
  if (!deviceId) {
    return NextResponse.json({ error: "Could not register this device." }, { status: 500 });
  }

  const [sessionToken, deviceToken] = await Promise.all([
    createSessionToken(),
    signDeviceId(deviceId),
  ]);
  if (!sessionToken || !deviceToken) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(ADMIN_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  // Outlives the session by a year. This is the "remember this device" half,
  // and it is also what stops Aditya's own visits being counted as traffic.
  res.cookies.set(DEVICE_COOKIE, deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEVICE_MAX_AGE,
  });

  return res;
}
