import { NextResponse } from "next/server";
import { setProjectVisibility } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Guarded by proxy.ts. Before that guard existed, anyone could POST here — or
// write to the table directly with the public key — and hide every project.
export async function POST(req: Request) {
  const { visibility } = await req.json().catch(() => ({}));

  if (!visibility || typeof visibility !== "object") {
    return NextResponse.json({ error: "Missing visibility" }, { status: 400 });
  }

  try {
    await setProjectVisibility(visibility);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
