"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export default function CreateExerciseForm({
  courseId,
  moduleId,
  lessonId,
}: Props) {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [type, setType] = useState<"TEXT" | "QCM" | "BOOLEAN">("TEXT");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState(10);
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            answer,
            type,
            points,
            deadline,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Erreur création exercice");

      router.push(
        `/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Créer un exercice</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Question *</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Type</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="TEXT">Texte</option>
            <option value="QCM">QCM</option>
            <option value="BOOLEAN">Vrai/Faux</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Réponse</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Points</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block mb-1">Deadline</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer l’exercice"}
        </button>
      </form>
    </div>
  );
}
