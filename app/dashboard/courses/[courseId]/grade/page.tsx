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
  const courseId = params?.courseId;

  const { data: session } = useSession();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const studentId = session?.user?.id ?? null;

  useEffect(() => {
    if (!courseId || !studentId) return;

    const fetchGrades = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/courses/${courseId}/grades?studentId=${studentId}`
        );

        if (!res.ok) throw new Error("Impossible de charger les notes");

        const data: Grade[] = await res.json();
        setGrades(data);

        // 🧮 Nouveau calcul basé sur les points réels
        const totalEarned = data.reduce((acc, g) => acc + g.score, 0);
        const totalPossible = data.reduce((acc, g) => acc + g.maxPoints, 0);

        const pct = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

        setPercentage(pct);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, studentId]);

  if (!studentId) return <p>Vous devez être connecté pour voir les notes.</p>;
  if (loading) return <p>Chargement des notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes du cours</h1>

      <p className="mb-4 text-lg">
        Pourcentage global : {percentage.toFixed(2)}%
      </p>

      {grades.length === 0 ? (
        <p>Aucune note disponible pour ce cours.</p>
      ) : (
        grades.map((g) => (
          <div key={g.exerciseId} className="border p-4 mb-3 rounded">
            <p>Exercice {g.exerciseId}</p>
            <p>
              Score : {g.score} / {g.maxPoints}
            </p>
            <p>Status : {g.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
