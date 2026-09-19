import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export default async function AdminProfessionalsList() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return <p>Supabase is not configured.</p>;

  const { data } = await supabase
    .from("professionals")
    .select("slug, name, status, category, city, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 16 }}>
        Professionals
      </h1>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
            <th style={{ padding: "8px 6px" }}>Name</th>
            <th style={{ padding: "8px 6px" }}>Category</th>
            <th style={{ padding: "8px 6px" }}>City</th>
            <th style={{ padding: "8px 6px" }}>Status</th>
            <th style={{ padding: "8px 6px" }}></th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((p) => (
            <tr key={p.slug} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "8px 6px" }}>{p.name}</td>
              <td style={{ padding: "8px 6px" }}>{p.category}</td>
              <td style={{ padding: "8px 6px" }}>{p.city}</td>
              <td style={{ padding: "8px 6px" }}>{p.status}</td>
              <td style={{ padding: "8px 6px" }}>
                <Link href={`/professionals/${p.slug}`} target="_blank">
                  View live →
                </Link>
              </td>
            </tr>
          ))}
          {!data?.length && (
            <tr>
              <td colSpan={5} style={{ padding: "16px 6px", color: "var(--muted)" }}>
                No professionals published yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
