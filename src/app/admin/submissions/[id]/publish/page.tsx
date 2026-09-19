import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { PublishForm } from "@/components/admin/publish-form";

export default async function PublishPage({
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
  if (!data || data.kind !== "application") notFound();

  const v = (data.values || {}) as Record<string, string>;

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <Link href={`/admin/submissions/${id}`}>&larr; Back to submission</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, marginBottom: 16 }}>
        Publish as professional
      </h1>
      <PublishForm
        submissionId={id}
        initial={{
          name: v.fullName || "",
          city: v.city || "",
          state: v.state || "",
          category: v.category || "",
          specialisations: v.specialisations || "",
          bio: v.bio || "",
          experience: v.experience ? `${v.experience} years of professional experience.` : "",
        }}
      />
    </div>
  );
}
