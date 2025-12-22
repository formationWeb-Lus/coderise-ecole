"use client";

import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { CourseMenu } from "../../../types/courses";

// Mock des cours
const courses: CourseMenu[] = [
  {
    id: "1",
    title: "Développement Web Full Stack",
    announcements: ["Bienvenue au cours !", "TP à rendre vendredi"],
    grades: [10, 12, 14],
    modules: Array.from({ length: 2 }, (_, i) => ({
      id: `m${i + 1}`,
      title: `Module ${i + 1}`,
      weeks: Array.from({ length: 12 }, (_, w) => ({
        weekNumber: w + 1,
        lessons: Array.from({ length: 6 }, (_, l) => ({
          id: `w${w + 1}l${l + 1}`,
          title: `Leçon ${l + 1} de la semaine ${w + 1}`,
        })),
      })),
    })),
  },
];

export default function StudentDashboard() {
  const [selectedModule, setSelectedModule] =
    useState<CourseMenu["modules"][0] | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        courses={courses}
        onSelectModule={(id) => {
          const module =
            courses[0].modules.find((m) => m.id === id) || null;
          setSelectedModule(module);
        }}
      />

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Dashboard Étudiant
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Sélectionne un cours dans la barre latérale pour voir les modules,
          semaines et leçons.
        </p>

        {/* Affichage des semaines si module sélectionné */}
        {selectedModule && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              {selectedModule.title} - Semaines
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {selectedModule.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className="bg-blue-600 text-white font-bold py-3 rounded text-center hover:bg-blue-500 cursor-pointer transition"
                >
                  S{week.weekNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
