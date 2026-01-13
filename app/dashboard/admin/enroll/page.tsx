import { prisma } from "@/lib/prisma";
import EnrollForm from "./EnrollForm";

export default async function EnrollPage() {
  // 🔹 Récupérer tous les étudiants (User.role = STUDENT)
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { name: "asc" },
  });

  // 🔹 Récupérer tous les cours
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Inscription des étudiants aux cours
      </h1>

      <EnrollForm students={students} courses={courses} />
    </div>
  );
}
