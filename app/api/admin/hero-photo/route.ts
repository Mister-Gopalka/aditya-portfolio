import { NextResponse } from "next/server";
import { setHeroPhotoSettings } from "@/lib/supabase";

export async function POST(req: Request) {
  const { x, y, scale } = await req.json();
  await setHeroPhotoSettings({ x, y, scale });
  return NextResponse.json({ ok: true });
}
