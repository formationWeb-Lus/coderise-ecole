"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  name: string | null;
  courses: string[];
};

export default function StudentsPage() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Étudiants inscrits à mes cours
      </h1>

      {data.length === 0 ? (
        <p>Aucun étudiant trouvé.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nom complet</th>
              <th className="border p-2">Cours inscrits</th>
            </tr>
          </thead>
          <tbody>
            {data.map(student => (
              <tr key={student.id}>
                <td className="border p-2">
                  {student.name ?? "—"}
                </td>
                <td className="border p-2">
                  {student.courses.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
