import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password)
    return Response.json({ ok: false, code: "unavailable" }, { status: 503 });

  let input: string;
  try {
    const form = await request.formData();
    input = String(form.get("password") || "");
  } catch {
    return Response.json({ ok: false, code: "validation" }, { status: 400 });
  }

  if (!checkPassword(input, password))
    return Response.json({ ok: false, code: "invalid" }, { status: 401 });

  const token = await createSessionToken();
  if (!token)
    return Response.json({ ok: false, code: "unavailable" }, { status: 503 });

  return Response.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": `${ADMIN_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`,
      },
    },
  );
}
