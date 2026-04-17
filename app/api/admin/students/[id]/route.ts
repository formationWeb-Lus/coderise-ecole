import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: any) {
  const { id } = params;

  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
  });

  return NextResponse.json(course);
}
