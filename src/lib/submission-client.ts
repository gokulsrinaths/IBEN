import type { SubmissionInput, SubmissionResult } from "./submissions";

export const formCopy = {
  application: {
    action: "Submit application",
    notice: "Online applications are not open yet.",
    unavailable:
      "Your application has not been sent. Online applications are not open yet. Your entries remain on this page.",
    error:
      "We could not confirm receipt of your application. Your entries remain on this page; please try again.",
    success: "Your application has been received.",
    nextStep: "Receipt does not mean selection or recognition.",
  },
  nomination: {
    action: "Submit nomination",
    notice: "Online nominations are not open yet.",
    unavailable:
      "Your nomination has not been sent. Online nominations are not open yet. Your entries remain on this page.",
    error:
      "We could not confirm receipt of your nomination. Your entries remain on this page; please try again.",
    success: "Your nomination has been received.",
    nextStep: "A nomination does not guarantee recognition.",
  },
  contact: {
    action: "Send enquiry",
    notice: "Online enquiries are not available yet.",
    unavailable:
      "Your enquiry has not been sent. Online enquiries are not available yet. Your message remains on this page.",
    error:
      "We could not confirm receipt of your enquiry. Your message remains on this page; please try again.",
    success: "Your enquiry has been received.",
    nextStep: "Keep this reference for any follow-up.",
  },
};

/** Availability checks contain no entries or files. Never transmit them while closed. */
export async function checkAvailability(): Promise<boolean> {
  try {
    const availability = await fetch("/api/submissions", {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!availability.ok) return false;
    const status: unknown = await availability.json();
    return (
      !!status &&
      typeof status === "object" &&
      "available" in status &&
      status.available === true
    );
  } catch {
    return false;
  }
}

/** Uploads one portfolio image to the private `portfolios` bucket.
 * Callers must confirm availability first -- this never runs while
 * submissions are closed. */
export async function uploadPortfolioFile(
  file: File,
): Promise<{ ok: true; path: string } | { ok: false }> {
  try {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/submissions/upload", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return { ok: false };
    const result: unknown = await response.json();
    if (
      result &&
      typeof result === "object" &&
      "ok" in result &&
      result.ok === true &&
      "path" in result &&
      typeof result.path === "string" &&
      result.path.startsWith("pending/")
    )
      return { ok: true, path: result.path };
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

export async function submitForm(
  input: SubmissionInput,
): Promise<SubmissionResult> {
  if (!(await checkAvailability())) return { ok: false, code: "unavailable" };
  const body = new FormData();
  body.set("kind", input.kind);
  body.set("values", JSON.stringify(input.values));
  const response = await fetch("/api/submissions", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 503) return { ok: false, code: "unavailable" };
  if (!response.ok) return { ok: false, code: "rejected" };
  const result: unknown = await response.json();
  if (
    result &&
    typeof result === "object" &&
    "ok" in result &&
    result.ok === true &&
    "reference" in result &&
    typeof result.reference === "string" &&
    result.reference.trim()
  )
    return { ok: true, reference: result.reference };
  return { ok: false, code: "rejected" };
}
