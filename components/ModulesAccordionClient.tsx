"use client";

import { useState } from "react";
import Link from "next/link";

interface Lesson {
  id: number | string;
  title: string;
}

interface Module {
  id: number | string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface ModulesAccordionProps {
  courseId: number;
  modules: Module[];
  completedLessons?: (number | string)[];
}

export default function ModulesAccordion({
  courseId,
  modules,
  completedLessons = [],
}: ModulesAccordionProps) {
  const [openWeek, setOpenWeek] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {modules.map((module, idx) => {
        const weekNumber = idx + 1;
        const isOpen = openWeek === idx;

        return (
          <div key={module.id} className="border rounded-lg shadow-sm bg-white">
            <button
              onClick={() => setOpenWeek(isOpen ? null : idx)}
              className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 rounded-t-lg transition-colors"
            >
              <span className="font-semibold">{`Semaine ${weekNumber} - ${module.title}`}</span>
              <span
                className="text-xl transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▼
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
              }`}
            >
              <ul>
                {module.lessons.map((lesson) => {
                  const completed = completedLessons.includes(lesson.id);
                  return (
                    <li key={lesson.id} className="mb-2 flex items-center justify-between">
                      <Link
                        href={`/dashboard/courses/${courseId}/modules/week-${weekNumber}/lesson/${lesson.id}`}
                        className={`text-blue-600 hover:underline ${completed ? "line-through text-gray-500" : ""}`}
                      >
                        {lesson.title}
                      </Link>
                      {completed && <span className="text-green-600 font-bold ml-2">✔</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
