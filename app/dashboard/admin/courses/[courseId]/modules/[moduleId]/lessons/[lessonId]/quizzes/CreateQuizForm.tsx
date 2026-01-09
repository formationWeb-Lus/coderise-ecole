"use client";

import { useState, useEffect } from "react";

type QuizType = "TEXT" | "QCM" | "BOOLEAN";

interface QuizQuestion {
  question: string;
  type: QuizType;
  options: string[];
  answer: string;
  points: number;
}

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

interface CreateQuizFormProps {
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
}

export default function CreateQuizForm({ courseId = "", moduleId = "", lessonId = "" }: CreateQuizFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>(courseId);
  const [selectedModule, setSelectedModule] = useState<string>(moduleId);
  const [selectedLesson, setSelectedLesson] = useState<string>(lessonId);

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    Array.from({ length: 10 }, () => ({
      question: "",
      type: "QCM",
      options: ["", "", "", ""],
      answer: "",
      points: 10,
    }))
  );

  const types: QuizType[] = ["TEXT", "QCM", "BOOLEAN"];

  // 🔹 Fetch courses
  useEffect(() => {
    fetch("/api/admin/courses")
      .then(res => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  // 🔹 Fetch modules quand cours sélectionné
  useEffect(() => {
    if (!selectedCourse) return;
    fetch(`/api/admin/courses/${selectedCourse}/modules`)
      .then(res => res.json())
      .then(setModules)
      .catch(console.error);

    setSelectedModule("");
    setLessons([]);
    setSelectedLesson("");
  }, [selectedCourse]);

  // 🔹 Fetch lessons quand module sélectionné
  useEffect(() => {
    if (!selectedCourse || !selectedModule) return;
    fetch(`/api/admin/courses/${selectedCourse}/modules/${selectedModule}/lessons`)
      .then(res => res.json())
      .then(setLessons)
      .catch(console.error);

    setSelectedLesson("");
  }, [selectedCourse, selectedModule]);

  const handleChangeQuestion = (index: number, field: keyof QuizQuestion, value: string | number | string[]) => {
    setQuestions(prev => {
      const copy = [...prev];
      const q = { ...copy[index] };

      if (field === "options") q.options = value as string[];
      else if (field === "points") q.points = value as number;
      else if (field === "type") q.type = value as QuizType;
      else q[field] = value as string;

      copy[index] = q;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return alert("Veuillez sélectionner une leçon");
    if (!title) return alert("Veuillez mettre un titre au quiz");

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.answer || (q.type === "QCM" && q.options.some(o => !o))) {
        return alert(`Veuillez remplir correctement la question ${i + 1}`);
      }
    }

    try {
      const res = await fetch(`/api/admin/lessons/${selectedLesson}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, questions }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur création du quiz");
      }

      alert("Quiz créé avec succès !");
      setTitle("");
      setQuestions(Array.from({ length: 10 }, () => ({
        question: "",
        type: "QCM",
        options: ["", "", "", ""],
        answer: "",
        points: 10,
      })));
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl p-6 bg-white rounded shadow space-y-6">
      {/* ===== Sélecteurs ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-bold">Cours</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Sélectionner un cours --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-bold">Module</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">-- Sélectionner un module --</option>
            {modules.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-bold">Leçon</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedLesson}
            onChange={e => setSelectedLesson(e.target.value)}
            disabled={!selectedModule}
          >
            <option value="">-- Sélectionner une leçon --</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Titre du quiz ===== */}
      <div>
        <label className="block mb-1 font-bold">Titre du quiz</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-yellow-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* ===== Questions ===== */}
      {questions.map((q, i) => (
        <div key={i} className="border p-4 rounded space-y-3 bg-gray-50">
          <h3 className="font-semibold text-lg">Question {i + 1}</h3>

          <input
            type="text"
            placeholder="Question"
            className="w-full border px-3 py-2 rounded"
            value={q.question}
            onChange={e => handleChangeQuestion(i, "question", e.target.value)}
            required
          />

          <select
            className="w-full border px-2 py-2 rounded"
            value={q.type}
            onChange={e => handleChangeQuestion(i, "type", e.target.value as QuizType)}
          >
            {types.map(t => (
              <option key={t} value={t}>
                {t === "TEXT" ? "Texte" : t === "QCM" ? "QCM" : "Vrai / Faux"}
              </option>
            ))}
          </select>

          {q.type === "QCM" &&
            q.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Option ${idx + 1}`}
                className="w-full border px-2 py-2 rounded"
                value={opt}
                onChange={e => {
                  const newOpts = [...q.options];
                  newOpts[idx] = e.target.value;
                  handleChangeQuestion(i, "options", newOpts);
                }}
                required
              />
            ))}

          <input
            type="text"
            placeholder="Réponse"
            className="w-full border px-2 py-2 rounded"
            value={q.answer}
            onChange={e => handleChangeQuestion(i, "answer", e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Points"
            className="w-full border px-2 py-2 rounded"
            value={q.points}
            onChange={e => handleChangeQuestion(i, "points", Number(e.target.value))}
          />
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
      >
        Créer le quiz
      </button>
    </form>
  );
}
