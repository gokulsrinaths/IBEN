import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!(await requireAdmin(request)))
    return Response.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return Response.json({ ok: false }, { status: 503 });

  const body = await request.json().catch(() => null);
  const required = [
    "slug",
    "name",
    "city",
    "state",
    "category",
    "recognition",
    "year",
    "profileId",
    "image",
    "bio",
    "experience",
  ];
  if (!body || required.some((k) => !body[k]))
    return Response.json({ ok: false, code: "validation" }, { status: 400 });

  const { error } = await supabase.from("professionals").insert({
    slug: body.slug,
    name: body.name,
    city: body.city,
    state: body.state,
    category: body.category,
    specialisations: Array.isArray(body.specialisations) ? body.specialisations : [],
    recognition: body.recognition,
    year: Number(body.year),
    profile_id: body.profileId,
    image: body.image,
    bio: body.bio,
    experience: body.experience,
    portfolio: Array.isArray(body.portfolio) ? body.portfolio : [],
    status: body.status === "published" ? "published" : "draft",
    submission_id: body.submissionId || null,
  });

  if (error) {
    const code = error.code === "23505" ? "duplicate" : "rejected";
    return Response.json({ ok: false, code, error: error.message }, { status: 400 });
  }

  revalidatePath("/professionals");
  revalidatePath(`/professionals/${body.slug}`);
  return Response.json({ ok: true });
}
