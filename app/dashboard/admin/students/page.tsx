import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function StudentsPage() {
  // 🔹 Récupérer tous les étudiants et leurs cours
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      studentCourses: {
        include: { course: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-900">Liste des étudiants</h1>

      {students.length === 0 ? (
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
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{s.name}</td>
                <td className="border px-4 py-2">{s.email}</td>
                <td className="border px-4 py-2">
                  {s.studentCourses.map((sc) => sc.course.title).join(", ")}
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
