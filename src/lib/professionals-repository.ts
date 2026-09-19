import "server-only";
import { getSupabaseAdmin } from "./supabase-admin";
import type { Professional } from "./data";

type Row = {
  slug: string;
  name: string;
  city: string;
  state: string;
  category: string;
  specialisations: string[];
  recognition: string;
  year: number;
  profile_id: string;
  image: string;
  bio: string;
  experience: string;
  portfolio: { image: string; caption: string }[];
};

function toProfessional(row: Row): Professional {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    category: row.category,
    specialisations: row.specialisations,
    recognition: row.recognition,
    year: row.year,
    profileId: row.profile_id,
    image: row.image,
    bio: row.bio,
    experience: row.experience,
    portfolio: row.portfolio,
  };
}

const columns =
  "slug, name, city, state, category, specialisations, recognition, year, profile_id, image, bio, experience, portfolio";

export async function getPublishedProfessionals(): Promise<Professional[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("professionals")
    .select(columns)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return ((data as Row[] | null) || []).map(toProfessional);
}

export async function getPublishedProfessionalBySlug(
  slug: string,
): Promise<Professional | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from("professionals")
    .select(columns)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return data ? toProfessional(data as Row) : null;
}
