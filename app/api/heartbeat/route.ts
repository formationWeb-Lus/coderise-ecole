// app/api/heartbeat/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Juste renvoyer 200 OK
  return NextResponse.json({ ok: true });
}