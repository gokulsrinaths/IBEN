import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { supabaseSubmissionRepository } from "@/lib/submission-repository";
import type { SubmissionKind } from "@/lib/submissions";

/** Available only once SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
 * configured. There is no other switch that enables intake. */
function isConfigured(): boolean {
  return getSupabaseAdmin() !== null;
}

export function GET() {
  return Response.json(
    { available: isConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

const kinds: SubmissionKind[] = ["application", "nomination", "contact"];

export async function POST(request: Request) {
  if (!isConfigured())
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
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const kind = form.get("kind");
  const rawValues = form.get("values");
  if (
    typeof kind !== "string" ||
    !kinds.includes(kind as SubmissionKind) ||
    typeof rawValues !== "string"
  )
    return Response.json(
      { ok: false, code: "validation" },
      { headers: { "Cache-Control": "no-store" } },
    );

  let values: Record<string, string>;
  try {
    const parsed: unknown = JSON.parse(rawValues);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Object.values(parsed).some((v) => typeof v !== "string")
    )
      throw new Error("invalid values shape");
    values = parsed as Record<string, string>;
  } catch {
    return Response.json(
      { ok: false, code: "validation" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await supabaseSubmissionRepository.create({
    kind: kind as SubmissionKind,
    values,
    files: [],
  });

  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
