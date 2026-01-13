import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentsPage() {
  // 🔹 Récupérer tous les utilisateurs étudiants
  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { name: "asc" },
  });

  // 🔹 Pour chaque utilisateur, récupérer le Student lié et ses cours
  const studentsWithCourses = await Promise.all(
    users.map(async (user) => {
      const student = await prisma.student.findFirst({
        where: { email: user.email ?? undefined },
      });

      const courses =
        student?.id
          ? await prisma.studentCourse.findMany({
              where: { studentId: student.id },
              include: { course: true },
            })
          : [];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        courses,
      };
    })
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-900">Liste des étudiants</h1>

      {studentsWithCourses.length === 0 ? (
        <p className="text-gray-600">Aucun étudiant trouvé.</p>
      ) : (
        <table className="min-w-full border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Nom</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Cours inscrits</th>
              <th className="border px-4 py-2 text-left">Voir la progression</th>
            </tr>
          </thead>

          <tbody>
            {studentsWithCourses.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.email}</td>
                <td className="border px-4 py-2">
                  {s.courses.map((sc) => sc.course?.title).filter(Boolean).join(", ") || "Aucun cours"}
                </td>
                <td className="border px-4 py-2">
                  <Link
                    href={`/dashboard/admin/students/${s.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Voir progression
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
