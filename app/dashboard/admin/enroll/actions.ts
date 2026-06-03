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
  // Vérifier que l'utilisateur connecté est autorisé
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  // Vérifier que l'étudiant existe
  const user = await prisma.user.findUnique({
    where: { id: studentUserId },
  });

  if (!user) {
    throw new Error("Étudiant introuvable");
  }

  // Vérifier que le cours existe
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Cours introuvable");
  }

  // Vérifier si l'étudiant est déjà inscrit
  const existingEnrollment = await prisma.studentCourse.findFirst({
    where: {
      userId: studentUserId,
      courseId,
    },
  });

  if (existingEnrollment) {
    throw new Error("Cet étudiant est déjà inscrit à ce cours");
  }

  // Inscrire l'étudiant
  const enrollment = await prisma.studentCourse.create({
    data: {
      userId: studentUserId, // ✅ Étudiant inscrit
      courseId,
    },
  });

  return {
    success: true,
    message: "Étudiant inscrit avec succès",
    enrollment,
  };
}
