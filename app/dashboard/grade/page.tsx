"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Grade {
  exerciseId: number;
  score: number;
  maxPoints: number;
  status: "PENDING" | "GRADED" | "LATE";
}

export default function CourseGradesPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const { data: session, status } = useSession();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!courseId || status !== "authenticated") return;

    const fetchGrades = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. GET STUDENT
        const studentRes = await fetch(
          `/api/student/by-email?email=${session?.user?.email}`
        );

        if (!studentRes.ok) {
          throw new Error("Student introuvable");
        }

        const student = await studentRes.json();

        // 2. GET GRADES
        const res = await fetch(
          `/api/courses/${courseId}/grades?studentId=${student.id}`
        );

        if (!res.ok) {
          throw new Error("Impossible de charger les notes");
        }

        const data: Grade[] = await res.json();
        setGrades(data);

        // 3. CALCUL POURCENTAGE
        const totalEarned = data.reduce((a, g) => a + (g.score || 0), 0);
        const totalPossible = data.reduce((a, g) => a + (g.maxPoints || 0), 0);

        setPercentage(
          totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement des notes");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, session, status]);

  if (status === "loading") return <p>Chargement session...</p>;
  if (!session) return <p>Vous devez être connecté</p>;
  if (loading) return <p>Chargement des notes...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes du cours</h1>

      <p className="mb-4 font-semibold">
        Pourcentage global: {percentage.toFixed(2)}%
      </p>

      {grades.length === 0 ? (
        <p>Aucune note disponible.</p>
      ) : (
        <div className="space-y-4">
          {grades.map((g, i) => (
            <div key={i} className="p-4 border rounded">
              <p className="font-bold">Exercice {g.exerciseId}</p>
              <p>Score: {g.score} / {g.maxPoints}</p>
              <p>Status: {g.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}