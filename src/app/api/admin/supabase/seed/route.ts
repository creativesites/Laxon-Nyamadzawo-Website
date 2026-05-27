import { NextResponse } from "next/server";
import { seedCurrentCmsContent } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function isAuthorized(secret?: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminPin = process.env.ADMIN_PIN || "";
  return Boolean(secret && (secret === adminPassword || secret === adminPin));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { secret?: string };

    if (!isAuthorized(body.secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await seedCurrentCmsContent();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to seed content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
