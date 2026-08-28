"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("SESSION CLIENT :", session);
    console.log("ROLE CLIENT :", session?.user?.role);
  }, [session]);

  useEffect(() => {
    if (status === "loading") return;

    // 🔒 Non connecté → redirige vers login
    if (!session) {
      router.replace("/auth/login");
      return;
    }

    // 🔒 Connecté mais pas admin → redirige vers unauthorized
    if (session.user.role !== "ADMIN") {
      router.replace("/auth/unauthorized");
      return;
    }
  }, [session, status, router]);

  // Affiche un loader pendant que la session est vérifiée
  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return <div className="p-6 text-center">Vérification des droits d’accès...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
      <p className="mb-6">
        Bienvenue dans le tableau de bord administrateur. Accédez rapidement à la création et à la gestion des cours, modules, leçons, exercices et assignments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 🔹 BOUTON : VOIR / MODIFIER LES MODULES DU COURS 34 */}
        <Link 
          href="/dashboard/admin/courses/34/modules" 
          className="bg-indigo-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-indigo-700 col-span-1 sm:col-span-2 lg:col-span-3 border-2 border-indigo-800"
        >
          📚 Voir et modifier les modules (Cours 34)
        </Link>

        {/* 🔹 BOUTON : MODIFIER ET GÉRER LES LEÇONS DU COURS 34 / MODULE 16 */}
        <Link 
          href="/dashboard/admin/courses/34/modules/16/lessons" 
          className="bg-amber-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-amber-700 col-span-1 sm:col-span-2 lg:col-span-3 border-2 border-amber-800"
        >
          ✏️ Modifier les leçons (Cours 34 - Module 16)
        </Link>

        <Link 
          href="/dashboard/admin/courses" 
          className="bg-blue-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-blue-700"
        >
          Créer un cours
        </Link>

        <Link 
          href="/dashboard/admin" 
          className="bg-green-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-green-700"
        >
          Modifier et supprimer les cours
        </Link>

        <Link 
          href="/dashboard/admin/courses/1/modules/create" 
          className="bg-emerald-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-emerald-700"
        >
          Créer un module
        </Link>

        <Link 
          href="/dashboard/admin/courses/2/modules/17/lessons/create" 
          className="bg-yellow-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-yellow-700"
        >
          Créer une leçon
        </Link>

        <Link 
          href="/dashboard/admin/courses/2/modules/17/lessons/35/exercises/create" 
          className="bg-purple-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-purple-700"
        >
          Créer un exercice
        </Link>

        <Link 
          href="/dashboard/admin/courses/2/modules/17/lessons/35/quizzes" 
          className="bg-indigo-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-indigo-700"
        >
          Créer les quizzes
        </Link>

        <Link 
          href="/dashboard/admin/submissions" 
          className="bg-pink-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-pink-700"
        >
          Gestion des assignments
        </Link>

        <Link 
          href="/dashboard/admin/students" 
          className="bg-teal-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-teal-700"
        >
          Voir les étudiants
        </Link>

        <Link 
          href="/enrollment" 
          className="bg-orange-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-orange-700"
        >
          Voir les cours d'inscriptions
        </Link>

        <Link 
          href="/dashboard/admin/enroll" 
          className="bg-gray-600 text-white px-6 py-4 rounded text-center font-semibold hover:bg-gray-700"
        >
          Enrôler étudiants au cours
        </Link>

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