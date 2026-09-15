import "server-only";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabase-admin";
import { CONSENT_VERSION } from "./legal";
import { personal, practice, nomination, contact, validateField } from "./form-fields";
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

function validate(input: SubmissionInput): string | null {
  const specs = fieldsByKind[input.kind];
  for (const spec of specs) {
    const value = input.values[spec.name] ?? "";
    const error = validateField(spec, value);
    if (error) return error;
    if (spec.type === "email" && value && !isValidEmail(value))
      return "Enter a valid email address.";
  }
  if (input.values.consent !== "yes") return "Consent is required.";
  if (input.kind !== "contact" && input.values.accuracy !== "yes")
    return "Accuracy confirmation is required.";
  return null;
}

function generateReference(kind: SubmissionInput["kind"]): string {
  const code = randomBytes(5).toString("hex").toUpperCase();
  return `IBEN-${referencePrefix[kind]}-${code}`;
}

/** Files are intentionally not persisted yet: the current multipart
 * transport can exceed serverless request-body limits at the full 8-file
 * / 5MB-each allowance. See OWNER_DECISIONS.md — signed upload URLs are
 * required before file storage can be enabled. The required portfolioUrl
 * field is what's reviewed until then. */
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
