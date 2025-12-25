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

        const totalEarned = data.reduce((acc, g) => acc + g.score, 0);
        const totalPossible = data.reduce((acc, g) => acc + g.maxPoints, 0);
        setPercentage(
          totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0
        );
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
      <h1 className="text-3xl font-bold mb-2 text-yellow-900">
        Notes du cours
      </h1>

      <p className="mb-6 text-lg font-semibold text-gray-700">
        Pourcentage global :{" "}
        <span className="text-green-700">
          {percentage.toFixed(2)}%
        </span>
      </p>

      {grades.length === 0 ? (
        <p>Aucune note disponible pour ce cours.</p>
      ) : (
        <div className="space-y-4">
          {grades.map((g) => {
            const isGreenLesson = g.exerciseId === 1 || g.exerciseId === 5;

            return (
              <div
                key={g.exerciseId}
                className={`p-4 rounded-lg border shadow-sm transition
                  ${
                    isGreenLesson
                      ? "bg-green-50 border-green-300"
                      : "bg-yellow-50 border-yellow-300"
                  }
                `}
              >
                {/* Titre de la leçon */}
                <p
                  className={`text-lg font-bold mb-1 cursor-pointer underline
                    ${
                      isGreenLesson
                        ? "text-green-700 hover:text-green-900"
                        : "text-yellow-700 hover:text-yellow-900"
                    }
                  `}
                >
                  Lesson {g.exerciseId} – SQL Topic
                </p>

                <p className="text-gray-700">
                  Score :{" "}
                  <span className="font-semibold">
                    {g.score} / {g.maxPoints}
                  </span>
                </p>

                <p
                  className={`font-semibold mt-1
                    ${
                      g.status === "GRADED"
                        ? "text-green-700"
                        : g.status === "LATE"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  `}
                >
                  Statut : {g.status}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
