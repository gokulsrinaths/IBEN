export type SubmissionKind = "application" | "nomination" | "contact";
/** Transport contract: multipart kind, values (JSON), and repeated portfolio files.
 * Keep the future implementation server-only. Validate all fields again on the server.
 */
export type SubmissionInput = {
  kind: SubmissionKind;
  values: Record<string, string>;
  files: File[];
};
export type SubmissionResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      code: "unavailable" | "validation" | "rate-limit" | "rejected";
    };
export interface SubmissionRepository {
  create(input: SubmissionInput): Promise<SubmissionResult>;
}
