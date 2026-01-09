"use client";

import { useEffect, useState } from "react";

interface Submission {
  id: number;
  type: "assignment" | "quiz";
  lesson: { title: string };
  score: number | null;
  totalPoints?: number; // seulement pour les quizzes
  status: string;
  feedback: string | null;
}

export default function GradesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetch("/api/student/grades") // API à adapter pour renvoyer assignments + quizzes
      .then((res) => res.json())
      .then((data) => setSubmissions(data));
  }, []);

  const sendComment = async (submissionId: number) => {
    const comment = comments[submissionId];
    if (!comment || comment.trim() === "") return alert("Commentaire vide.");

    const res = await fetch("/api/student/grades/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId, comment }),
    });

    if (res.ok) {
      alert("Commentaire envoyé !");
      setComments((prev) => ({ ...prev, [submissionId]: "" }));
    } else {
      alert("Erreur lors de l’envoi.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Notes</h1>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Leçon / Quiz</th>
            <th className="border px-4 py-2 text-left">Score</th>
            <th className="border px-4 py-2 text-left">Status</th>
            <th className="border px-4 py-2 text-left">Feedback</th>
            <th className="border px-4 py-2 text-left">Commenter</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((s: Submission) => {
            const displayScore =
              s.type === "quiz" && s.totalPoints != null && s.score != null
                ? `${s.score} / ${s.totalPoints} (${((s.score / s.totalPoints) * 100).toFixed(1)}%)`
                : s.score != null
                ? s.score
                : "—";

            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{s.lesson.title}</td>
                <td className="border px-4 py-2">{displayScore}</td>
                <td className="border px-4 py-2">{s.status}</td>
                <td className="border px-4 py-2">{s.feedback ?? "—"}</td>

                <td className="border px-4 py-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Votre commentaire..."
                      value={comments[s.id] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                    />
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => sendComment(s.id)}
                    >
                      Envoyer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
