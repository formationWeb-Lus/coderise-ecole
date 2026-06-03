"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function enrollStudent({
  studentUserId,
  courseId,
}: {
  studentUserId: number;
  courseId: number;
}) {
  // Vérifier la session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  // Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: {
      id: studentUserId,
    },
  });

  if (!user) {
    throw new Error("Étudiant introuvable");
  }

  if (!user.email) {
    throw new Error(
      "L'étudiant doit avoir une adresse email"
    );
  }

  // Vérifier que le cours existe
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Cours introuvable");
  }

  // Rechercher l'étudiant dans la table Student
  let student = await prisma.student.findUnique({
    where: {
      email: user.email,
    },
  });

  // Le créer s'il n'existe pas
  if (!student) {
    student = await prisma.student.create({
      data: {
        name: user.name || "Sans nom",
        email: user.email,
      },
    });
  }

  // Vérifier si déjà inscrit
  const existingEnrollment =
    await prisma.studentCourse.findFirst({
      where: {
        userId: studentUserId,
        courseId,
      },
    });

  if (existingEnrollment) {
    throw new Error(
      "Cet étudiant est déjà inscrit à ce cours"
    );
  }

  // Créer l'inscription
  const enrollment =
    await prisma.studentCourse.create({
      data: {
        userId: studentUserId,
        studentId: student.id,
        courseId,
      },
    });

  return {
    success: true,
    message: "Étudiant inscrit avec succès",
    enrollment,
  };
}
