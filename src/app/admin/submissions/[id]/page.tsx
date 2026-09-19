import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { StatusForm } from "@/components/admin/status-form";

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  if (!supabase) return <p>Supabase is not configured.</p>;

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const values = (data.values || {}) as Record<string, string>;

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/admin/submissions">&larr; All submissions</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 4 }}>
        {data.reference}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
        {data.kind} · submitted {new Date(data.created_at).toLocaleString()} · consent v
        {data.consent_version} at {new Date(data.consent_at).toLocaleString()}
      </p>

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>Submitted values</h2>
      <dl style={{ marginBottom: 28, fontSize: 13 }}>
        {Object.entries(values).map(([key, value]) => (
          <div key={key} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
            <dt style={{ color: "var(--muted)" }}>{key}</dt>
            <dd style={{ whiteSpace: "pre-wrap" }}>{value || "—"}</dd>
          </div>
        ))}
      </dl>

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>Review</h2>
      <StatusForm
        id={data.id}
        status={data.status}
        reviewerNotes={data.reviewer_notes || ""}
      />

      {data.kind === "application" && data.status === "accepted" && (
        <p style={{ marginTop: 24 }}>
          <Link className="button button-dark" href={`/admin/submissions/${data.id}/publish`}>
            Publish as professional →
          </Link>
        </p>
      )}
    </div>
  );
}
