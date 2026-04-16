import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  moduleId: string;
};

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  const moduleId = Number(params.moduleId);

  if (isNaN(moduleId)) {
    return NextResponse.json(
      { error: "moduleId invalide" },
      { status: 400 }
    );
  }

  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(lessons);
}

export async function POST(
  req: Request,
  { params }: { params: Params }
) {
  const moduleId = Number(params.moduleId);
  const body = await req.json();

  const { title, content, order } = body;

  const lesson = await prisma.lesson.create({
    data: {
      title,
      content,
      moduleId,
      order: order ?? 1,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}