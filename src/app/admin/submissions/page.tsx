import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Row = {
  id: string;
  kind: string;
  reference: string;
  status: string;
  values: Record<string, string>;
  created_at: string;
};

export default async function SubmissionsList({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; status?: string }>;
}) {
  const { kind, status } = await searchParams;
  const supabase = getSupabaseAdmin();
  if (!supabase) return <p>Supabase is not configured.</p>;

  let query = supabase
    .from("submissions")
    .select("id, kind, reference, status, values, created_at")
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  const rows = (data as Row[] | null) || [];

  const filterLink = (params: Record<string, string | undefined>) => {
    const usp = new URLSearchParams();
    if (params.kind) usp.set("kind", params.kind);
    if (params.status) usp.set("status", params.status);
    const qs = usp.toString();
    return `/admin/submissions${qs ? `?${qs}` : ""}`;
  };

  const nameOf = (v: Record<string, string>) =>
    v.fullName || v.nomineeName || v.name || "—";

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 16 }}>
        Submissions
      </h1>
      {error && <p className="status-message error">{error.message}</p>}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, fontSize: 12 }}>
        <Link href={filterLink({ status })}>All kinds</Link>
        <Link href={filterLink({ kind: "application", status })}>Applications</Link>
        <Link href={filterLink({ kind: "nomination", status })}>Nominations</Link>
        <Link href={filterLink({ kind: "contact", status })}>Enquiries</Link>
        <span>·</span>
        <Link href={filterLink({ kind })}>All statuses</Link>
        <Link href={filterLink({ kind, status: "received" })}>Received</Link>
        <Link href={filterLink({ kind, status: "accepted" })}>Accepted</Link>
        <Link href={filterLink({ kind, status: "declined" })}>Declined</Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
            <th style={{ padding: "8px 6px" }}>Reference</th>
            <th style={{ padding: "8px 6px" }}>Kind</th>
            <th style={{ padding: "8px 6px" }}>Name</th>
            <th style={{ padding: "8px 6px" }}>Status</th>
            <th style={{ padding: "8px 6px" }}>Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "8px 6px" }}>
                <Link href={`/admin/submissions/${r.id}`}>{r.reference}</Link>
              </td>
              <td style={{ padding: "8px 6px" }}>{r.kind}</td>
              <td style={{ padding: "8px 6px" }}>{nameOf(r.values)}</td>
              <td style={{ padding: "8px 6px" }}>{r.status}</td>
              <td style={{ padding: "8px 6px" }}>
                {new Date(r.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
          {!rows.length && !error && (
            <tr>
              <td colSpan={5} style={{ padding: "16px 6px", color: "var(--muted)" }}>
                No submissions match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
