"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const [courseId, setCourseId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [quizId, setQuizId] = useState("");

  const [question, setQuestion] = useState("");
  const [type, setType] = useState<"TEXT" | "QCM" | "BOOLEAN">("TEXT");
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>(["", "", "", ""]);
  const [points, setPoints] = useState(10);
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(() => setError("Erreur chargement cours"));
  }, []);

  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/admin/courses/${courseId}/modules`)
      .then((res) => res.json())
      .then(setModules);

    setModuleId("");
    setLessonId("");
    setQuizId("");
  }, [courseId]);

  useEffect(() => {
    if (!moduleId) return;

    fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/lessons`)
      .then((res) => res.json())
      .then(setLessons);

    setLessonId("");
    setQuizId("");
  }, [moduleId]);

  useEffect(() => {
    if (!lessonId) return;

    fetch(
      `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`
    )
      .then((res) => res.json())
      .then(setQuizzes);

    setQuizId("");
  }, [lessonId]);

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
        payload.choices = choices.filter((c) => c.trim());
      }

      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Erreur création exercice");

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

  const inputClass =
    "w-full bg-[#0f2740] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500";

  return (
    <div className="min-h-screen bg-[#0a1b2d] text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          🧠 Créer un exercice
        </h1>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-[#0f2740] p-6 rounded-xl border border-gray-700"
        >

          {/* COURSE */}
          <select
            className={inputClass}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">📚 Choisir un cours</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* MODULE */}
          <select
            className={inputClass}
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            disabled={!courseId}
          >
            <option value="">📦 Choisir un module</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          {/* LESSON */}
          <select
            className={inputClass}
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            disabled={!moduleId}
          >
            <option value="">📘 Choisir une leçon</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>

          {/* QUESTION */}
          <textarea
            className={inputClass}
            rows={3}
            placeholder="✍️ Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* TYPE */}
          <select
            className={inputClass}
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="TEXT">Texte</option>
            <option value="QCM">QCM</option>
            <option value="BOOLEAN">Vrai / Faux</option>
          </select>

          {/* QCM */}
          {type === "QCM" && (
            <div className="space-y-2">
              {choices.map((c, i) => (
                <input
                  key={i}
                  className={inputClass}
                  placeholder={`Option ${i + 1}`}
                  value={c}
                  onChange={(e) =>
                    setChoices((prev) => {
                      const copy = [...prev];
                      copy[i] = e.target.value;
                      return copy;
                    })
                  }
                />
              ))}
            </div>
          )}

          {/* ANSWER */}
          <input
            className={inputClass}
            placeholder="Réponse"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          {/* POINTS */}
          <input
            type="number"
            className={inputClass}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
          />

          {/* DEADLINE */}
          <input
            type="datetime-local"
            className={inputClass}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || !lessonId}
            className="w-full bg-blue-500 hover:bg-blue-600 transition py-3 rounded-lg font-semibold"
          >
            {loading ? "Création..." : "Créer l’exercice"}
          </button>
        </form>
      </div>
    </div>
  );
}
