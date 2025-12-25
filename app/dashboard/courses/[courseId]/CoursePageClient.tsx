"use client";

import { useState } from "react";

interface Lesson {
  id: number;
  title: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CoursePageClientProps {
  courseId: number;
  modules: Module[];
}

export default function CoursePageClient({
  courseId,
  modules,
}: CoursePageClientProps) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  if (!modules || modules.length === 0) {
    return (
      <p className="text-yellow-900 text-lg">
        Aucun module disponible pour ce cours.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {modules.map((module, idx) => {
        const isOpen = openModuleId === module.id;

        return (
          <div
            key={module.id}
            className="rounded-xl border border-yellow-300 bg-yellow-50 shadow-md"
          >
            {/* 🔸 TITRE SEMAINE */}
            <button
              onClick={() =>
                setOpenModuleId(isOpen ? null : module.id)
              }
              className="
                w-full px-6 py-4
                bg-yellow-200
                flex justify-between items-center
                rounded-t-xl
                text-left
              "
            >
              <h2 className="text-2xl font-bold text-yellow-900">
                S {idx + 1} — {module.title}
              </h2>

              <span className="text-2xl font-bold text-yellow-900">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {/* 🔹 LEÇONS */}
            {isOpen && (
              <ul className="p-6 space-y-4">
                {module.lessons.slice(0, 5).map((lesson) => (
                  <li key={lesson.id}>
                    <a
                      href={`/dashboard/courses/${courseId}/modules/week-${idx + 1}/lesson/${lesson.id}`}
                      className="
                        text-xl font-semibold
                        text-green-700
                        underline underline-offset-4
                        hover:text-green-900
                        transition-colors
                        block
                      "
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
