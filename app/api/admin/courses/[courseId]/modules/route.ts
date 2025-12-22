import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  courseId: string;
}

export async function GET(req: Request, context: { params: Params | Promise<Params> }) {
  const resolvedParams = await context.params;
  const { courseId } = resolvedParams;

  if (!courseId) return NextResponse.json({ error: "courseId manquant" }, { status: 400 });

  const courseIdNumber = Number(courseId);
  if (isNaN(courseIdNumber)) return NextResponse.json({ error: "courseId invalide" }, { status: 400 });

  const modules = await prisma.module.findMany({
    where: { courseId: courseIdNumber },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(modules);
}

export async function POST(req: Request, context: { params: Params | Promise<Params> }) {
  const resolvedParams = await context.params;
  const { courseId } = resolvedParams;

  const courseIdNumber = Number(courseId);
  const body = await req.json();
  const { title, order } = body;

  const newModule = await prisma.module.create({
    data: { courseId: courseIdNumber, title, order },
  });

  return NextResponse.json(newModule, { status: 201 });
}
