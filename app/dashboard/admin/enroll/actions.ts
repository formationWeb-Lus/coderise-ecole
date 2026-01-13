"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function enrollStudent({
  studentUserId, // User sélectionné
  courseId,
}: {
  studentUserId: number;
  courseId: number;
}) {
  // 🔹 Vérifier la session de l'admin
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const adminId = Number(session.user.id);

  // 🔹 Récupérer le User sélectionné
  const user = await prisma.user.findUnique({ where: { id: studentUserId } });
  if (!user) throw new Error("Utilisateur non trouvé");

  // 🔹 Vérifier que l'utilisateur a un email
  if (!user.email) {
    throw new Error("L'utilisateur sélectionné n'a pas d'email valide");
  }

  // 🔹 Vérifier si un Student existe pour ce User
  let student = await prisma.student.findFirst({
    where: { email: user.email },
  });

  // 🔹 Si pas existant, créer un Student
  if (!student) {
    student = await prisma.student.create({
      data: {
        name: user.name ?? "Nom inconnu",
        email: user.email,
      },
    });
  }

  // 🔹 Vérifier doublon StudentCourse
  const existing = await prisma.studentCourse.findFirst({
    where: { studentId: student.id, courseId },
  });

  if (existing) throw new Error("Cet étudiant est déjà inscrit à ce cours");

  // 🔹 Créer StudentCourse
  await prisma.studentCourse.create({
    data: {
      userId: adminId, // admin qui inscrit
      studentId: student.id,
      courseId,
    },
  });
}
