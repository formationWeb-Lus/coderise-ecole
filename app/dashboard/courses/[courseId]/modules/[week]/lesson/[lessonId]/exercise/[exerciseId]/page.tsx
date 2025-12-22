"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Exercise {
  id: number;
  question: string;
  type: "TEXT" | "BOOLEAN" | "QCM";
  points: number;
}

interface Result {
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
}

export default function ExercisesPage() {
  const params = useParams();
  const router = useRouter();

  // 🔹 Récupération des bons params selon ton arborescence
  const courseId = params.courseId as string;
  const moduleId = (params.week ?? params.moduleId) as string; // ← ici c'est [week]
  const lessonId = params.lessonId as string;
  const exerciseId = params.exerciseId as string;

  // 🔹 Vérification obligatoire
  if (!courseId || !moduleId || !lessonId || !exerciseId) {
    throw new Error(
      "Paramètres de route invalides : courseId, moduleId, lessonId ou exerciseId manquant"
    );
  }

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Charger les exercices pour la leçon
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/exercises?lessonId=${lessonId}`);
        if (!res.ok) throw new Error("Impossible de charger les exercices");
        setExercises(await res.json());
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    }
    load();
  }, [lessonId]);

  // 🔹 Soumettre les réponses et récupérer les résultats
  async function submit() {
    setLoading(true);
    setError("");
    setResults({});
    try {
      const res = await fetch("/api/exercises/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: Number(courseId),
          moduleId,
          lessonId: Number(lessonId),
          answers,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la soumission des exercices");

      const data = await res.json();
      setResults(data.results);
      setTotalPoints(data.totalPoints);
      setEarnedPoints(data.earnedPoints);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Exercices – Leçon {lessonId}</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {exercises.map((ex) => (
        <div key={ex.id} className="border p-4 mb-4 rounded">
          <p className="font-semibold">{ex.question}</p>

          {ex.type === "TEXT" && (
            <textarea
              className="border w-full mt-2 p-2"
              value={answers[ex.id] || ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))
              }
            />
          )}

          {ex.type === "BOOLEAN" && (
            <div className="mt-2 space-x-4">
              {["true", "false"].map((v) => (
                <label key={v}>
                  <input
                    type="radio"
                    name={`ex-${ex.id}`}
                    value={v}
                    checked={answers[ex.id] === v}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))
                    }
                  />{" "}
                  {v}
                </label>
              ))}
            </div>
          )}

          {ex.type === "QCM" && (
            <select
              className="border w-full mt-2 p-2"
              value={answers[ex.id] || ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))
              }
            >
              <option value="">Choisir…</option>
              <option value="let">let</option>
              <option value="var">var</option>
              <option value="const">const</option>
            </select>
          )}

          {results[ex.id] && (
            <p
              className={`mt-2 font-semibold ${
                results[ex.id].correct ? "text-green-600" : "text-red-600"
              }`}
            >
              {results[ex.id].correct
                ? "Correct"
                : "Incorrect"} – {results[ex.id].earnedPoints}/{results[ex.id].maxPoints} pts
            </p>
          )}
        </div>
      ))}

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Soumission..." : "Soumettre"}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg mb-2">Score total :</h2>
          <p>
            {earnedPoints} / {totalPoints} points
          </p>
        </div>
      )}
    </div>
  );
}
