import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { submissionStatuses } from "@/lib/submission-status";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(request)))
    return Response.json({ ok: false }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;
  const reviewerNotes = typeof body?.reviewerNotes === "string" ? body.reviewerNotes : undefined;
  const reviewedBy = typeof body?.reviewedBy === "string" ? body.reviewedBy.trim() : "";
  if (
    typeof status !== "string" ||
    !(submissionStatuses as readonly string[]).includes(status)
  )
    return Response.json({ ok: false, code: "validation" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return Response.json({ ok: false }, { status: 503 });

  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      ...(reviewerNotes !== undefined ? { reviewer_notes: reviewerNotes } : {}),
      reviewed_by: reviewedBy || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
