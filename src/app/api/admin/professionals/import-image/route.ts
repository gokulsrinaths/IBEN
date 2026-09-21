import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** Copies one applicant-uploaded image from the private `portfolios`
 * bucket (where the public Apply form puts them, under `pending/`)
 * into the public `professional-photos` bucket, so it can be used on
 * a published profile. Nothing in the private bucket is ever exposed
 * directly -- only this server-side copy produces a public URL. */
export async function POST(request: Request) {
  if (!(await requireAdmin(request)))
    return Response.json({ ok: false }, { status: 401 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return Response.json({ ok: false }, { status: 503 });

  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path : "";
  const folder = String(body?.folder || "professional").replace(/[^a-z0-9-]/gi, "");
  if (!path.startsWith("pending/"))
    return Response.json({ ok: false, code: "validation" }, { status: 400 });

  const { data: file, error: downloadError } = await supabase.storage
    .from("portfolios")
    .download(path);
  if (downloadError || !file)
    return Response.json({ ok: false, code: "rejected" }, { status: 404 });

  const ext = path.split(".").pop() || "jpg";
  const destPath = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("professional-photos")
    .upload(destPath, await file.arrayBuffer(), { contentType: file.type });
  if (uploadError)
    return Response.json({ ok: false, code: "rejected" }, { status: 500 });

  const { data } = supabase.storage.from("professional-photos").getPublicUrl(destPath);
  return Response.json({ ok: true, url: data.publicUrl });
}
