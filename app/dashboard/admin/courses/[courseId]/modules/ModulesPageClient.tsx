"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Module {
  id: number;
  title: string;
  order: number;
}

interface ModulesPageClientProps {
  courseId: string;
}

export default function ModulesPageClient({ courseId }: ModulesPageClientProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!courseId) return;

  const fetchModules = async () => {
    try {
      console.log("Fetch modules pour courseId:", courseId);

      // ✅ URL correcte pour ton API
      const res = await fetch(`/api/admin/courses/${courseId}/modules`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Erreur HTTP ${res.status}`);
      }

      setModules(data);
    } catch (err: any) {
      console.error("Erreur fetch modules:", err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  fetchModules();
}, [courseId]);

  if (loading) return <div className="p-6">Chargement des modules...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur : {error}</div>;
  if (modules.length === 0) return <div className="p-6">Aucun module trouvé pour ce cours.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Modules du cours {courseId}</h1>

      <Link
        href={`/dashboard/admin/courses/${courseId}/modules/create`}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Créer un module
      </Link>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Titre</th>
            <th className="border px-4 py-2">Ordre</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((m) => (
            <tr key={m.id}>
              <td className="border px-4 py-2">{m.title}</td>
              <td className="border px-4 py-2">{m.order}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/dashboard/admin/courses/${courseId}/modules/${m.id}/edit`}
                  className="text-purple-600 underline mr-2"
                >
                  Modifier
                </Link>
                <Link
                  href={`/dashboard/admin/courses/${courseId}/modules/${m.id}/lessons`}
                  className="text-blue-600 underline"
                >
                  Leçons
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
