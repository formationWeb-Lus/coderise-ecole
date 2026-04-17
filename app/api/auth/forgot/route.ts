import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { identifier } = await req.json();

  const token = crypto.randomUUID();

  // TODO:
  // 1. Trouver l’utilisateur par email / phone / username
  // 2. Sauvegarder hash(token) + expiration en DB
  // 3. Envoyer email ou SMS avec :
  //    https://tonsite.com/auth/reset?token=XXXX

  console.log("RESET TOKEN:", token);

  return NextResponse.json({ success: true });
}
