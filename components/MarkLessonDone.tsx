"use client";

import { useState, useEffect } from "react";

interface MarkLessonDoneProps {
  courseId: number;
  lessonId: number;
}

export default function MarkLessonDone({ courseId, lessonId }: MarkLessonDoneProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optionnel : vérifier si la leçon est déjà complétée au chargement
  useEffect(() => {
    const checkCompleted = async () => {
      try {
        const res = await fetch(`/api/lessons/complete?lessonId=${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.completed) setCompleted(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkCompleted();
  }, [lessonId]);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
     const res = await fetch("/api/lessons/complete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ lessonId, courseId }),
  credentials: "include", // ✅ Important pour que NextAuth reconnaisse la session
});


      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setCompleted(true);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleClick}
        disabled={loading || completed}
        className={`px-4 py-2 rounded text-white ${
          completed ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "..." : completed ? "Terminé ✅" : "Marquer comme terminé"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
