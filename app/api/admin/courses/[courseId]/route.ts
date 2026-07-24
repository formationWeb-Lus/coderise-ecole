import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==========================================
// GET : Récupérer un cours
// ==========================================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID de cours invalide." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        modules: true,
        announcements: true,
        payments: true,
        studentCourses: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { message: "Cours introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("GET COURSE :", error);

    return NextResponse.json(
      {
        message: "Erreur serveur.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// PUT : Modifier un cours
// ==========================================
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID de cours invalide." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        {
          message: "Cours introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        duration: Number(body.duration),
      },
      include: {
        modules: true,
        announcements: true,
        payments: true,
        studentCourses: true,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("PUT COURSE :", error);

    return NextResponse.json(
      {
        message: "Erreur lors de la modification.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE : Supprimer un cours
// ==========================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    const id = Number(courseId);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID de cours invalide." },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json(
        {
          message: "Cours introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.course.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cours supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE COURSE :", error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression.",
      },
      {
        status: 500,
      }
    );
  }
}