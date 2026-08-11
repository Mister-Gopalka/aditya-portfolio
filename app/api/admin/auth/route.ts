import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: null }));

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true, // unreadable from JS, so a script on the page cannot lift it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
