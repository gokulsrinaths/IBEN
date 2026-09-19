import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await requireAdmin(request)))
    return Response.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return Response.json({ ok: false }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "misc").replace(/[^a-z0-9-]/gi, "");

  if (!(file instanceof File) || !allowedTypes.includes(file.type) || file.size > maxSize)
    return Response.json({ ok: false, code: "validation" }, { status: 400 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("professional-photos")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("professional-photos").getPublicUrl(path);
  return Response.json({ ok: true, url: data.publicUrl });
}
