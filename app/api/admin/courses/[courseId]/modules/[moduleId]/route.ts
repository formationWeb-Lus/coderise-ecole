import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: any) {
  const { moduleId } = params;

  const moduleData = await prisma.module.findUnique({
    where: { id: Number(moduleId) },
  });

  return NextResponse.json(moduleData);
}

export async function PUT(req: Request, { params }: any) {
  const { moduleId } = params;
  const body = await req.json();

  const updated = await prisma.module.update({
    where: { id: Number(moduleId) },
    data: {
      title: body.title,
      order: body.order,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const { moduleId } = params;

  await prisma.module.delete({
    where: { id: Number(moduleId) },
  });

  return NextResponse.json({ message: "Module supprimé" });
}
