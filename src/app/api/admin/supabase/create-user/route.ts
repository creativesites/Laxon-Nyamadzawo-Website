import { NextResponse } from "next/server";
import { createSupabaseAdminUser } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function isAuthorized(secret?: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminPin = process.env.ADMIN_PIN || "";
  return Boolean(secret && (secret === adminPassword || secret === adminPin));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      secret?: string;
      email?: string;
      password?: string;
      name?: string;
    };

    if (!isAuthorized(body.secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await createSupabaseAdminUser({
      email: body.email,
      password: body.password,
      name: body.name,
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create admin user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
