"use client";

import Link from "next/link";

const courses = [
  {
    id: "1",
    title: "Développement Web Full Stack",
    description: "HTML, CSS, JavaScript, React, Node.js",
  },
  {
    id: "2",
    title: "Analyse de Données",
    description: "Python, Pandas, NumPy, Matplotlib",
  },
];

export default function CoursesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mes cours</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses/${course.id}`}
            className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
