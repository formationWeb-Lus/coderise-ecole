"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Question {
  id: number;
  quizId: number;
  question: string;
  type: "TEXT" | "QCM" | "BOOLEAN";
  options: string[];
  answer: string | boolean; // ⚡ BOOLEAN peut être bool
  points: number;
}

interface Result {
  correct: boolean;
  earnedPoints: number;
  maxPoints: number;
}

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizzeId as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, Result>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 🔹 Charger les questions
  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/questions?quizId=${quizId}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Impossible de charger le quiz");

        const data: Question[] = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    if (quizId) loadQuestions();
  }, [quizId]);

  // 🔹 Soumission du quiz
  async function submitQuiz() {
    if (submitted) return;

    let points = 0;
    let earned = 0;
    const newResults: Record<number, Result> = {};

    // ✅ Calcul du score
    questions.forEach((q) => {
      const userAnswer = answers[q.id] ?? "";

      let correct = false;

      if (q.type === "BOOLEAN") {
        // comparer string vs bool de la DB
        correct = String(q.answer) === userAnswer;
      } else {
        correct = userAnswer === q.answer;
      }

      newResults[q.id] = {
        correct,
        earnedPoints: correct ? q.points : 0,
        maxPoints: q.points,
      };

      points += q.points;
      earned += correct ? q.points : 0;
    });

    setResults(newResults);
    setTotalPoints(points);
    setEarnedPoints(earned);
    setSubmitted(true);

    console.log("Answers:", answers);
    console.log("Earned points:", earned);

    // 🔹 Envoyer le score au backend
    try {
      const res = await fetch("/api/quiz-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⚡ important pour NextAuth
        body: JSON.stringify({
          quizId: Number(quizId),
          score: earned, // 🔥 score exact
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("Erreur API:", data);
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du score", err);
    }
  }

  // 🔹 États
  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );

  if (error)
    return <p className="text-center mt-20 text-red-600">{error}</p>;

  if (questions.length === 0)
    return (
      <p className="text-center mt-20 text-gray-500">
        Aucune question disponible
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <h1 className="text-2xl font-bold">Quiz</h1>
          <span className="text-sm text-gray-500">{questions.length} questions</span>
        </div>

        {/* Questions */}
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {q.type}
              </span>
            </div>

            {/* TEXT */}
            {q.type === "TEXT" && (
              <textarea
                disabled={submitted}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={answers[q.id] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
              />
            )}

            {/* BOOLEAN */}
            {q.type === "BOOLEAN" && (
              <div className="flex gap-6">
                {["true", "false"].map((v) => (
                  <label key={v} className="flex items-center gap-2">
                    <input
                      type="radio"
                      disabled={submitted}
                      name={`q-${q.id}`}
                      value={v}
                      checked={answers[q.id] === v}
                      onChange={(e) =>
                        setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                      }
                      className="accent-blue-600"
                    />
                    {v}
                  </label>
                ))}
              </div>
            )}

            {/* QCM */}
            {q.type === "QCM" && (
              <select
                disabled={submitted}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                value={answers[q.id] || ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                }
              >
                <option value="">Choisir une réponse</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {/* Résultat */}
            {results[q.id] && (
              <div
                className={`p-3 rounded-lg font-semibold ${
                  results[q.id].correct
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {results[q.id].correct ? "✔ Bonne réponse" : "✖ Mauvaise réponse"} –{" "}
                {results[q.id].earnedPoints}/{results[q.id].maxPoints} pts
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <button
            onClick={submitQuiz}
            disabled={submitted}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              submitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Soumettre le quiz
          </button>

          {submitted && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Score total</p>
              <p className="text-xl font-bold">{earnedPoints} / {totalPoints}</p>
              <p className="text-sm text-gray-500">
                {((earnedPoints / totalPoints) * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
