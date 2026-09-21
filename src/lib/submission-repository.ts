import "server-only";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabase-admin";
import { CONSENT_VERSION } from "./legal";
import {
  personal,
  practice,
  nomination,
  contact,
  validateField,
  MIN_PORTFOLIO_IMAGES,
} from "./form-fields";
import type {
  SubmissionInput,
  SubmissionResult,
  SubmissionRepository,
} from "./submissions";

const fieldsByKind = {
  application: [...personal, ...practice],
  nomination,
  contact,
} as const;

const referencePrefix = {
  application: "APP",
  nomination: "NOM",
  contact: "ENQ",
} as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function countPortfolioImages(values: Record<string, string>): number {
  try {
    const parsed: unknown = JSON.parse(values.portfolioObjectKeys || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((p) => typeof p === "string" && p.startsWith("pending/")).length
      : 0;
  } catch {
    return 0;
  }
}

function validate(input: SubmissionInput): string | null {
  const specs = fieldsByKind[input.kind];
  for (const spec of specs) {
    if (spec.showIf && !spec.showIf(input.values)) continue;
    const value = input.values[spec.name] ?? "";
    const error = validateField(spec, value);
    if (error) return error;
    if (spec.type === "email" && value && !isValidEmail(value))
      return "Enter a valid email address.";
  }
  if (input.kind === "application" && countPortfolioImages(input.values) < MIN_PORTFOLIO_IMAGES)
    return `At least ${MIN_PORTFOLIO_IMAGES} portfolio images are required.`;
  if (input.values.consent !== "yes") return "Consent is required.";
  if (input.kind !== "contact" && input.values.accuracy !== "yes")
    return "Accuracy confirmation is required.";
  return null;
}

function generateReference(kind: SubmissionInput["kind"]): string {
  const code = randomBytes(5).toString("hex").toUpperCase();
  return `IBEN-${referencePrefix[kind]}-${code}`;
}

/** Portfolio images are uploaded separately, one file per request, via
 * /api/submissions/upload before this runs -- see that route and
 * uploadPortfolioFile() in submission-client.ts. Only the resulting
 * object paths (values.portfolioObjectKeys) reach here. */
export const supabaseSubmissionRepository: SubmissionRepository = {
  async create(input: SubmissionInput): Promise<SubmissionResult> {
    const validationError = validate(input);
    if (validationError) return { ok: false, code: "validation" };

    const supabase = getSupabaseAdmin();
    if (!supabase) return { ok: false, code: "unavailable" };

    for (let attempt = 0; attempt < 3; attempt++) {
      const reference = generateReference(input.kind);
      const { error } = await supabase.from("submissions").insert({
        kind: input.kind,
        reference,
        values: input.values,
        consent_version: CONSENT_VERSION,
      });
      if (!error) return { ok: true, reference };
      if (error.code !== "23505") {
        return { ok: false, code: "rejected" };
      }
      // 23505 = unique_violation on reference; retry with a new one.
    }
    return { ok: false, code: "rejected" };
  },
};
