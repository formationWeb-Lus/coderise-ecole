import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ Import corrigé

// Vérifier si admin
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// GET : Toutes les leçons d’un module
export async function GET(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const moduleId = Number(params.moduleId);

  const lessons = await prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(lessons);
}

// POST : Créer une nouvelle leçon
export async function POST(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const moduleId = Number(params.moduleId);
  const { title, description, content, order } = await req.json();

  if (!title) {
    return NextResponse.json(
      { error: "Le titre est obligatoire." },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      description,
      content,
      order: order ?? 1,
      moduleId,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
