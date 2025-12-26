// app/api/profile/get/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) return NextResponse.json({ error: "Email manquant" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  return NextResponse.json({ image: user?.image || null });
}
