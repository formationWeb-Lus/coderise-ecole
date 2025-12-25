"use client";

import { useState } from "react";

interface Props {
  submissionId: number;
  studentName: string;
  lessonName: string;
}

export default function GradeAssignment({
  submissionId,
  studentName,
  lessonName,
}: Props) {
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleGrade = async () => {
    try {
      const res = await fetch("/api/admin/gradeSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          score,
          feedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setMessage(
        `Devoir corrigé avec succès. Notification envoyée à ${studentName}.`
      );
    } catch (err: any) {
      setMessage(`Erreur : ${err.message}`);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-semibold mb-2">
        Corriger — {studentName} ({lessonName})
      </h3>

      <div className="mb-2">
        <label className="block text-sm">Note</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border p-1 w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border p-1 w-full"
        />
      </div>

      <button
        onClick={handleGrade}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enregistrer et notifier
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
