import { NextResponse } from "next/server";
import { setFontPairing, FontPairing } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { pairing } = await req.json();
  await setFontPairing(pairing as FontPairing);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
