"use client";

import { useEffect, useState } from "react";

interface Lesson {
  id: number;
  title: string;
  order: number;
}

interface Props {
  params: Promise<{ courseId: string; moduleId: string }>;
}

export default function LessonsPageClient({ params }: Props) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Résolution des params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setCourseId(resolved.courseId);
      setModuleId(resolved.moduleId);
    };
    resolveParams();
  }, [params]);

  // 🔹 Fetch lessons seulement si courseId et moduleId sont disponibles
  useEffect(() => {
    if (!courseId || !moduleId) return;

    const fetchLessons = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/admin/courses/${courseId}/modules/${moduleId}/lessons`
        );

        let data: any = [];
        try {
          data = await res.json();
        } catch {
          data = [];
        }

        if (!res.ok) throw new Error(data?.error || `Erreur HTTP ${res.status}`);
        if (!Array.isArray(data)) data = [];
        setLessons(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        console.error("Erreur fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId, moduleId]);

  if (loading) return <div>Chargement des leçons...</div>;
  if (error) return <div className="text-red-600">Erreur : {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Leçons du module {moduleId} (cours {courseId})
      </h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Titre</th>
            <th className="border px-4 py-2">Ordre</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l) => (
            <tr key={l.id}>
              <td className="border px-4 py-2">{l.id}</td>
              <td className="border px-4 py-2">{l.title}</td>
              <td className="border px-4 py-2">{l.order}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
