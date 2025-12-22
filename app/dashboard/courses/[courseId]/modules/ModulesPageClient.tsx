"use client";

import { useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Props {
  courseId: string;
}

export default function ModulesPageClient({ courseId }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/courses/${courseId}/modules`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Modules reçus :", data);
        setModules(data);
      })
      .catch((err) => console.error("Erreur fetch modules :", err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-4">Chargement des modules...</div>;
  if (!modules.length) return <div className="p-4">Aucun module trouvé.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modules du cours</h1>

      {modules.map((module, index) => {
        const weekNumber = index + 1;
        const isOpen = openWeek === index;

        return (
          <div key={module.id} className="border rounded-lg mb-3 shadow-sm bg-white">
            {/* Titre semaine */}
            <button
              onClick={() => setOpenWeek(isOpen ? null : index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 rounded-t-lg transition"
            >
              <span className="font-semibold">
                {`Semaine ${weekNumber} - ${module.title}`}
              </span>
              <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
            </button>

            {/* Accordéon */}
            {isOpen && (
              <ul className="p-4 animate-fadeIn">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="mb-2">
                    <a
                      href={`/dashboard/courses/${courseId}/modules/week-${weekNumber}/lesson/${lesson.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
