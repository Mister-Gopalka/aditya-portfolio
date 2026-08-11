import { supabaseAdmin } from "./supabase";

export type Submission = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  requirement: string | null;
  read_at: string | null;
  archived_at: string | null;
};

/** Newest first. Archived messages are kept, not deleted, and hidden by default. */
export async function listSubmissions(includeArchived = false): Promise<Submission[]> {
  if (!supabaseAdmin) return [];
  let query = supabaseAdmin
    .from("contact_submissions")
    .select("id, created_at, name, phone, requirement, read_at, archived_at")
    .order("created_at", { ascending: false });

  if (!includeArchived) query = query.is("archived_at", null);

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Submission[];
}

export async function markRead(id: string, read: boolean) {
  if (!supabaseAdmin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const { error } = await supabaseAdmin
    .from("contact_submissions")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setArchived(id: string, archived: boolean) {
  if (!supabaseAdmin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const { error } = await supabaseAdmin
    .from("contact_submissions")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createSubmission(input: {
  name: string;
  phone: string;
  requirement: string;
}): Promise<void> {
  if (!supabaseAdmin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const { error } = await supabaseAdmin.from("contact_submissions").insert(input);
  if (error) throw new Error(error.message);
}
