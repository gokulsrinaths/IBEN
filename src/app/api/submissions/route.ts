/** Fail closed until persistence, validation, consent and upload handling are configured.
 * GET is a non-personal availability check. POST never reads or stores the body.
 * Replace these handlers with a server-side SubmissionRepository integration.
 */
export function GET() {
  return Response.json(
    { available: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export function POST() {
  return Response.json(
    { ok: false, code: "unavailable" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
