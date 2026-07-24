"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  duration: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch("/api/admin/courses");

      if (!res.ok) throw new Error("Erreur");

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourse(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer ce cours ?"
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/courses/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Impossible de supprimer le cours.");
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        Chargement des cours...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Gestion des cours
        </h1>

        <Link
          href="/dashboard/admin/courses/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          + Nouveau cours
        </Link>

      </div>

      {courses.length === 0 ? (
        <div className="text-gray-500">
          Aucun cours disponible.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {courses.map((course) => (

            <div
              key={course.id}
              className="border rounded-lg shadow p-4 bg-white"
            >

              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}

              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {course.description}
              </p>

              <p className="mt-3 font-semibold">
                Durée : {course.duration} heures
              </p>

              <div className="flex gap-2 mt-5">

                <Link
                  href={`/dashboard/admin/courses/${course.id}/edit`}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center"
                >
                  Modifier
                </Link>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                >
                  Supprimer
                </button>

              </div>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}