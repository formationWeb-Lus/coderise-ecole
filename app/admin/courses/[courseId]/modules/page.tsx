"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ModulesPage({ params }: any) {
  const { courseId } = params;

  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/modules`)
      .then((res) => res.json())
      .then((data) => setModules(data));
  }, [courseId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modules du cours #{courseId}</h1>

      <Link
        href={`/dashboard/admin/courses/${courseId}/modules/create`}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ajouter un module
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
          {modules.map((m: any) => (
            <tr key={m.id}>
              <td className="border px-4 py-2">{m.id}</td>
              <td className="border px-4 py-2">{m.title}</td>
              <td className="border px-4 py-2">{m.order}</td>

              <td className="border px-4 py-2">
                <Link
                  className="text-blue-600 underline"
                  href={`/dashboard/admin/courses/${courseId}/modules/${m.id}`}
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
