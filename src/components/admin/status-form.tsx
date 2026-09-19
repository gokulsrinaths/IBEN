"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["received", "in_review", "accepted", "declined", "withdrawn"];

export function StatusForm({
  id,
  status: initialStatus,
  reviewerNotes: initialNotes,
}: {
  id: string;
  status: string;
  reviewerNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [reviewerNotes, setReviewerNotes] = useState(initialNotes);
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    const res = await fetch(`/api/admin/submissions/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewerNotes }),
    });
    setPending(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Reviewer notes</span>
        <textarea
          rows={3}
          value={reviewerNotes}
          onChange={(e) => setReviewerNotes(e.target.value)}
        />
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="submit" className="button button-dark" disabled={pending}>
          {pending ? "Saving..." : "Save status"}
        </button>
        {saved && <span style={{ fontSize: 12, color: "var(--muted)" }}>Saved.</span>}
      </div>
    </form>
  );
}
