import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type FontPairing = "A" | "B" | "C";

export async function getFontPairing(): Promise<FontPairing> {
  if (!supabase) return "A";
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "font_pairing")
    .single();
  return (data?.value as FontPairing) || "A";
}

export async function setFontPairing(pairing: FontPairing) {
  if (!supabase) return;
  await supabase
    .from("site_settings")
    .upsert({ key: "font_pairing", value: pairing });
}

export async function getProjectVisibility(): Promise<Record<string, boolean>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "project_visibility")
    .single();
  if (!data?.value) return {};
  try {
    return JSON.parse(data.value);
  } catch {
    return {};
  }
}

export async function setProjectVisibility(visibility: Record<string, boolean>) {
  if (!supabase) return;
  await supabase
    .from("site_settings")
    .upsert({ key: "project_visibility", value: JSON.stringify(visibility) });
}

export type HeroPhotoSettings = { x: number; y: number; scale: number };

export async function getHeroPhotoSettings(): Promise<HeroPhotoSettings> {
  if (!supabase) return { x: 27, y: 21, scale: 1.75 };
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_photo")
    .single();
  if (!data?.value) return { x: 27, y: 21, scale: 1.75 };
  try {
    return JSON.parse(data.value);
  } catch {
    return { x: 27, y: 21, scale: 1.75 };
  }
}

export async function setHeroPhotoSettings(settings: HeroPhotoSettings) {
  if (!supabase) return;
  await supabase
    .from("site_settings")
    .upsert({ key: "hero_photo", value: JSON.stringify(settings) });
}
