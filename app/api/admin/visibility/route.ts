import { NextResponse } from "next/server";
import { setProjectVisibility } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const { visibility } = await req.json();
  await setProjectVisibility(visibility);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
