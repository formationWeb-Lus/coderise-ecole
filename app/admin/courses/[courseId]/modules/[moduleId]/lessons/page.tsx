"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LessonsPage({ params }: any) {
  const { courseId, moduleId } = params;
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/modules/${moduleId}/lessons`)
      .then((res) => res.json())
      .then((data) => setLessons(data));
  }, [moduleId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Leçons du module #{moduleId}</h1>

      <Link
        href={`/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons/create`}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ajouter une leçon
      </Link>

      <table className="min-w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Titre</th>
            <th className="border px-4 py-2">Ordre</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {lessons.map((l: any) => (
            <tr key={l.id}>
              <td className="border px-4 py-2">{l.id}</td>
              <td className="border px-4 py-2">{l.title}</td>
              <td className="border px-4 py-2">{l.order}</td>

              <td className="border px-4 py-2">
                <Link
                  href={`/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons/${l.id}`}
                  className="text-blue-600 underline"
                >
                  Modifier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
