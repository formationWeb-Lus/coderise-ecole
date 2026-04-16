import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: any) {
  const { id } = params;

  const course = await prisma.course.findUnique({
    where: { id: Number(id) },
  });

  return NextResponse.json(course);
}
