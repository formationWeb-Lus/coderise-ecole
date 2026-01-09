"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ===== Types ===== */
interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
}

export default function CreateExerciseForm() {
  const router = useRouter();

  /* ===== Sélections ===== */
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [quizId, setQuizId] = useState("");

  /* ===== Exercice ===== */
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<"TEXT" | "QCM" | "BOOLEAN">("TEXT");
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>(["", "", "", ""]); // pour QCM
  const [points, setPoints] = useState(10);
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===== Charger les cours ===== */
  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(() => setError("Erreur chargement des cours"));
  }, []);

  /* ===== Charger les modules selon le cours ===== */
  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/admin/courses/${courseId}/modules`)
      .then((res) => res.json())
      .then(setModules)
      .catch(() => setError("Erreur chargement des modules"));

    setModuleId("");
    setLessonId("");
    setLessons([]);
    setQuizzes([]);
    setQuizId("");
  }, [courseId]);

  /* ===== Charger les leçons selon le module ===== */
  useEffect(() => {
    if (!courseId || !moduleId) return;

    fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons`)
      .then((res) => res.json())
      .then(setLessons)
      .catch(() => setError("Erreur chargement des leçons"));

    setLessonId("");
    setQuizzes([]);
    setQuizId("");
  }, [moduleId, courseId]);

  /* ===== Charger les quizzes selon la leçon ===== */
  useEffect(() => {
    if (!lessonId) return;

    fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`)
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(() => setError("Erreur chargement des quizzes"));

    setQuizId("");
  }, [lessonId]);

  /* ===== Soumission ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        question,
        type,
        answer,
        points,
        deadline,
        quizId: quizId || null,
      };

      if (type === "QCM") {
        payload.choices = choices.filter((c) => c.trim() !== "");
      }

      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur création exercice");

      router.push(
        `/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
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
        {/* ===== Cours ===== */}
        <div>
          <label className="block mb-1">Cours *</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Sélectionner un cours --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Module ===== */}
        <div>
          <label className="block mb-1">Module *</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            disabled={!courseId}
            required
          >
            <option value="">-- Sélectionner un module --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Leçon ===== */}
        <div>
          <label className="block mb-1">Leçon *</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            disabled={!moduleId}
            required
          >
            <option value="">-- Sélectionner une leçon --</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Quiz ===== */}
        <div>
          <label className="block mb-1">Quiz</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            disabled={!lessonId}
          >
            <option value="">-- Sélectionner un quiz ou laissez vide --</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        {/* ===== Question ===== */}
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

        {/* ===== Type ===== */}
        <div>
          <label className="block mb-1">Type</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="TEXT">Texte</option>
            <option value="QCM">QCM</option>
            <option value="BOOLEAN">Vrai / Faux</option>
          </select>
        </div>

        {/* ===== QCM Choices ===== */}
        {type === "QCM" && (
          <div>
            <label className="block mb-1">Choix (QCM)</label>
            {choices.map((choice, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                className="w-full border px-3 py-2 rounded mb-1"
                value={choice}
                onChange={(e) =>
                  setChoices((prev) => {
                    const copy = [...prev];
                    copy[idx] = e.target.value;
                    return copy;
                  })
                }
              />
            ))}
          </div>
        )}

        {/* ===== Réponse ===== */}
        <div>
          <label className="block mb-1">Réponse</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        {/* ===== Points ===== */}
        <div>
          <label className="block mb-1">Points</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />
        </div>

        {/* ===== Deadline ===== */}
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
          disabled={loading || !lessonId}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer l’exercice"}
        </button>
      </form>
    </div>
  );
}
