"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <p className="mb-6">
        Bienvenue dans le tableau de bord administrateur. Accédez rapidement à la création et à la gestion des cours, modules, leçons, exercices et assignments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Création de cours */}
        <Link
          href="/dashboard/admin/courses"
          className="bg-blue-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-blue-700"
        >
          Créer un cours
        </Link>

        {/* Création de module */}
        <Link
          href="/dashboard/admin/courses/1/modules/create"
          className="bg-green-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-green-700"
        >
          Créer un module
        </Link>

        {/* Création de leçon */}
        <Link
          href="/dashboard/admin/courses/2/modules/17/lessons/create"
          className="bg-yellow-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-yellow-700"
        >
          Créer une leçon
        </Link>

        {/* Création d’exercice */}
        <Link
          href="/dashboard/admin/courses/2/modules/17/lessons/35/exercises/create"
          className="bg-purple-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-purple-700"
        >
          Créer un exercice
        </Link>

        {/* Gestion des exercices */}
        <Link
          href="/dashboard/admin/courses/2/modules/17/lessons/35/exercises"
          className="bg-indigo-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-indigo-700"
        >
          Gestion des exercices
        </Link>

        {/* Gestion des assignments */}
        <Link
          href="/dashboard/admin/courses/2/modules/17/lessons/35/assignment"
          className="bg-pink-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-pink-700"
        >
          Gestion des assignments
        </Link>

        {/* Voir un module comme étudiant */}
        <Link
          href="/dashboard/courses/1/modules"
          className="bg-teal-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-teal-700"
        >
          Voir un module (étudiant)
        </Link>

        {/* Voir une leçon comme étudiant */}
        <Link
          href="/dashboard/courses/1"
          className="bg-orange-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-orange-700"
        >
          Voir une leçon (étudiant)
        </Link>

        {/* Voir les grades comme étudiant */}
        <Link
          href="/dashboard/courses/2/grade"
          className="bg-gray-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-gray-700"
        >
          Voir les grades (étudiant)
        </Link>

        {/* Accéder à la soumission d’assignment comme étudiant */}
        <Link
          href="/dashboard/courses/1/modules/week/lesson/12/assignment"
          className="bg-red-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-red-700"
        >
          Soumission d’assignment (étudiant)
        </Link>
      </div>
    </div>
  );
}
