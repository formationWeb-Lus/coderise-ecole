import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = {
  moduleId: string;
};

// 🔹 GET
export async function GET(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { moduleId } = await params; // 👈 Résolution de la promesse

    const moduleData = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
    });

    if (!moduleData) {
      return NextResponse.json(
        { error: "Module non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(moduleData);
  } catch (error) {
    console.error("GET MODULE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur récupération module" },
      { status: 500 }
    );
  }
}

// 🔹 PUT
export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { moduleId } = await params; // 👈 Résolution de la promesse
    const body = await req.json();

    const updated = await prisma.module.update({
      where: { id: Number(moduleId) },
      data: {
        title: body.title,
        order: body.order ? Number(body.order) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE MODULE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur mise à jour module" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { moduleId } = await params; // 👈 Résolution de la promesse

    await prisma.module.delete({
      where: { id: Number(moduleId) },
    });

    return NextResponse.json({ message: "Module supprimé" });
  } catch (error) {
    console.error("DELETE MODULE ERROR:", error);
    return NextResponse.json(
      { error: "Erreur suppression module" },
      { status: 500 }
    );
  }
}