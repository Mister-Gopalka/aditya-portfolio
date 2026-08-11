// Next 16 renamed the `middleware` file convention to `proxy`.
//
// This is the only thing standing between the open internet and the admin
// write routes. It runs before any /api/admin/* route executes, so an
// unauthenticated request never reaches code that can read a submission or
// change what the homepage shows.
//
// /api/admin/auth is exempt: it is how you get a session in the first place.
// The /admin page guards itself in `app/admin/page.tsx` — it is a server
// component, so the check there happens before any markup is produced.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  const authed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
