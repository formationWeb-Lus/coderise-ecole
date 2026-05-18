"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Grade {
  id: number;
  score: number | null;
  status: "PENDING" | "SUBMITTED" | "GRADED" | "LATE";
  lesson: {
    title: string;
  };
}

export default function CourseGradesPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const { data: session, status } = useSession();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || status !== "authenticated") return;

    const fetchGrades = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/student/grades");

        if (!res.ok) {
          throw new Error("Impossible de charger les notes");
        }

        const data = await res.json();
        setGrades(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId, status]);

  if (status === "loading") {
    return <p>Chargement session...</p>;
  }

  if (!session?.user) {
    return <p>Vous devez être connecté.</p>;
  }

  if (loading) return <p>Chargement des notes...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes du cours</h1>

      {grades.length === 0 ? (
        <p>Aucune note disponible.</p>
      ) : (
        <div className="space-y-4">
          {grades.map((g) => (
            <div key={g.id} className="p-4 border rounded">
              <p className="font-bold">{g.lesson?.title}</p>

              <p>Score: {g.score ?? 0}</p>

              <p>Status: {g.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}