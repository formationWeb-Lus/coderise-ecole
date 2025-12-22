import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const { lessonId } = params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: Number(lessonId) },
  });

  return NextResponse.json(lesson);
}

export async function PUT(req: Request, { params }: any) {
  const { lessonId } = params;
  const body = await req.json();

  const updated = await prisma.lesson.update({
    where: { id: Number(lessonId) },
    data: {
      title: body.title,
      order: body.order,
      content: body.content,
      videoUrl: body.videoUrl,
      pdfUrl: body.pdfUrl,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const { lessonId } = params;

  await prisma.lesson.delete({
    where: { id: Number(lessonId) },
  });

  return NextResponse.json({ message: "Leçon supprimée" });
}
