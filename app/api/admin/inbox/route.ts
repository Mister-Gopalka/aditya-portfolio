import { NextResponse } from "next/server";
import { markRead, setArchived } from "@/lib/inbox";
import { revalidatePath } from "next/cache";

// Guarded by proxy.ts — an unauthenticated request never reaches this file.
export async function POST(req: Request) {
  const { id, action } = await req.json().catch(() => ({}));

  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    switch (action) {
      case "read":
        await markRead(id, true);
        break;
      case "unread":
        await markRead(id, false);
        break;
      case "archive":
        await setArchived(id, true);
        break;
      case "unarchive":
        await setArchived(id, false);
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
