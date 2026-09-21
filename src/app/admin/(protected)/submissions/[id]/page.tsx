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
  const { portfolioObjectKeys, ...displayValues } = values;

  let portfolioUrls: string[] = [];
  if (portfolioObjectKeys) {
    try {
      const paths: unknown = JSON.parse(portfolioObjectKeys);
      if (Array.isArray(paths) && paths.every((p) => typeof p === "string")) {
        const signed = await Promise.all(
          paths.map((path) =>
            supabase.storage.from("portfolios").createSignedUrl(path, 3600),
          ),
        );
        portfolioUrls = signed
          .map((s) => s.data?.signedUrl)
          .filter((u): u is string => Boolean(u));
      }
    } catch {
      // malformed value -- ignore, nothing to show
    }
  }

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
        {Object.entries(displayValues).map(([key, value]) => (
          <div key={key} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 8, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
            <dt style={{ color: "var(--muted)" }}>{key}</dt>
            <dd style={{ whiteSpace: "pre-wrap" }}>{value || "—"}</dd>
          </div>
        ))}
      </dl>

      {portfolioUrls.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, marginBottom: 10 }}>
            Uploaded portfolio images ({portfolioUrls.length})
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
            {portfolioUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Applicant-uploaded portfolio image"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", border: "1px solid var(--line)" }}
                />
              </a>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: -18, marginBottom: 28 }}>
            Links expire after 1 hour. Reload this page for fresh links.
          </p>
        </>
      )}

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>Review</h2>
      <StatusForm
        id={data.id}
        status={data.status}
        reviewerNotes={data.reviewer_notes || ""}
        reviewedBy={data.reviewed_by || ""}
        reviewedAt={data.reviewed_at}
      />

      {data.kind === "application" && data.status === "selected" && (
        <p style={{ marginTop: 24 }}>
          <Link className="button button-dark" href={`/admin/submissions/${data.id}/publish`}>
            Publish as professional →
          </Link>
        </p>
      )}
    </div>
  );
}
