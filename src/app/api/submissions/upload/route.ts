import { getSupabaseAdmin } from "@/lib/supabase-admin";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 5 * 1024 * 1024;

/** Public portfolio upload for the Apply/Nominate forms. One file per
 * request -- this sidesteps the multipart size problem noted for the
 * full-form submission (a public 8-file batch could exceed serverless
 * request-body limits), the same pattern already used for admin
 * uploads. Files land in the private `portfolios` bucket under a
 * random `pending/` path; nothing here is publicly readable, and
 * nothing is promoted to a public URL until an admin reviews and
 * publishes the application through /admin. */
export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase)
    return Response.json(
      { ok: false, code: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { ok: false, code: "validation" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const file = form.get("file");
  if (
    !(file instanceof File) ||
    !allowedTypes.includes(file.type) ||
    file.size > maxSize
  )
    return Response.json(
      { ok: false, code: "validation" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `pending/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("portfolios")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });
  if (error)
    return Response.json(
      { ok: false, code: "rejected" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );

  return Response.json(
    { ok: true, path },
    { headers: { "Cache-Control": "no-store" } },
  );
}
