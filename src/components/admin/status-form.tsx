"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { submissionStatuses, statusLabels } from "@/lib/submission-status";

const REVIEWER_KEY = "iben-admin-reviewer-name";

export function StatusForm({
  id,
  status: initialStatus,
  reviewerNotes: initialNotes,
  reviewedBy: initialReviewedBy,
  reviewedAt,
}: {
  id: string;
  status: string;
  reviewerNotes: string;
  reviewedBy: string;
  reviewedAt: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [reviewerNotes, setReviewerNotes] = useState(initialNotes);
  const [reviewedBy, setReviewedBy] = useState(
    () => initialReviewedBy || (typeof window !== "undefined" ? localStorage.getItem(REVIEWER_KEY) || "" : ""),
  );
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setSaved(false);
    const res = await fetch(`/api/admin/submissions/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewerNotes, reviewedBy }),
    });
    setPending(false);
    if (res.ok) {
      if (reviewedBy) localStorage.setItem(REVIEWER_KEY, reviewedBy);
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {submissionStatuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Reviewed by</span>
        <input
          type="text"
          value={reviewedBy}
          onChange={(e) => setReviewedBy(e.target.value)}
          placeholder="Your name"
        />
      </label>
      <label className="field">
        <span>Reviewer notes</span>
        <textarea
          rows={3}
          value={reviewerNotes}
          onChange={(e) => setReviewerNotes(e.target.value)}
        />
      </label>
      {reviewedAt && (
        <p style={{ fontSize: 11, color: "var(--muted)" }}>
          Last reviewed {new Date(reviewedAt).toLocaleString()}
          {initialReviewedBy ? ` by ${initialReviewedBy}` : ""}.
        </p>
      )}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="submit" className="button button-dark" disabled={pending}>
          {pending ? "Saving..." : "Save status"}
        </button>
        {saved && <span style={{ fontSize: 12, color: "var(--muted)" }}>Saved.</span>}
      </div>
    </form>
  );
}
