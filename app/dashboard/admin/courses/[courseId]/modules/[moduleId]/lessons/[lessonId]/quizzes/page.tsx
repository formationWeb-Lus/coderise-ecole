"use client";

import { useState, useEffect } from "react";

type QuizType = "TEXT" | "QCM";

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

// 🔹 Questionnaire pré-rempli (Toutes les questions Vrai/Faux ont été transformées en TEXT)
const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    question: "Quel éditeur de code est principalement recommandé pour le développement Web Full-Stack modern ?",
    type: "QCM",
    options: ["Notepad++", "Visual Studio Code", "Sublime Text 2", "Vim"],
    answer: "Visual Studio Code",
    points: 10,
  },
  {
    question: "Pourquoi le terminal est-il indispensable en développement Web moderne ?",
    type: "TEXT",
    options: ["", "", "", ""],
    answer: "Pour exécuter des commandes CLI, lancer des serveurs et gérer les paquets",
    points: 10,
  },
  {
    question: "Que signifie l'acronyme CLI ?",
    type: "QCM",
    options: [
      "Command Line Interface",
      "Code Language Integration",
      "Control Level Interaction",
      "Central Logic Input",
    ],
    answer: "Command Line Interface",
    points: 10,
  },
  {
    question: "Quelle commande permet d'afficher la version actuellement installée de Node.js ?",
    type: "TEXT",
    options: ["", "", "", ""],
    answer: "node -v",
    points: 10,
  },
  {
    question: "Quelle est la différence principale entre Git et GitHub ?",
    type: "TEXT",
    options: ["", "", "", ""],
    answer: "Git est un système de contrôle de version local et GitHub est un service d'hébergement distant",
    points: 10,
  },
  {
    question: "Quel outil est un gestionnaire de paquets officiel pour Node.js ?",
    type: "QCM",
    options: ["Composer", "npm", "Pip", "Maven"],
    answer: "npm",
    points: 10,
  },
  {
    question: "Quelle extension VS Code permet de formater automatiquement le code HTML, CSS et JS ?",
    type: "QCM",
    options: ["Live Server", "Prettier", "GitLens", "ESLint"],
    answer: "Prettier",
    points: 10,
  },
  {
    question: "Quelle commande permet d'initialiser un projet avec un fichier package.json par défaut ?",
    type: "TEXT",
    options: ["", "", "", ""],
    answer: "npm init -y",
    points: 10,
  },
  {
    question: "Dans quel fichier de configuration doit-on stocker les clés API et variables d'environnement confidentielles ?",
    type: "TEXT",
    options: ["", "", "", ""],
    answer: ".env",
    points: 10,
  },
  {
    question: "Quel est le rôle principal des DevTools intégrés aux navigateurs (Chrome/Firefox/Edge) ?",
    type: "QCM",
    options: [
      "Écrire le code source du projet",
      "Déboguer, inspecter le DOM et analyser les requêtes réseau",
      "Héberger l'application en ligne",
      "Compiler le code TypeScript",
    ],
    answer: "Déboguer, inspecter le DOM et analyser les requêtes réseau",
    points: 10,
  },
];

export default function CreateQuizForm({
  courseId = "",
  moduleId = "",
  lessonId = "",
}: CreateQuizFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>(courseId);
  const [selectedModule, setSelectedModule] = useState<string>(moduleId);
  const [selectedLesson, setSelectedLesson] = useState<string>(lessonId);

  const [title, setTitle] = useState(
    "Evaluation : Maîtriser les outils et configurer son environnement"
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUESTIONS);

  const types: QuizType[] = ["TEXT", "QCM"];

  // 🔹 Fetch courses
  useEffect(() => {
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);
  }, []);

  // 🔹 Fetch modules quand cours sélectionné
  useEffect(() => {
    if (!selectedCourse) return;
    fetch(`/api/admin/courses/${selectedCourse}/modules`)
      .then((res) => res.json())
      .then(setModules)
      .catch(console.error);

    setSelectedModule("");
    setLessons([]);
    setSelectedLesson("");
  }, [selectedCourse]);

  // 🔹 Fetch lessons quand module sélectionné
  useEffect(() => {
    if (!selectedCourse || !selectedModule) return;
    fetch(
      `/api/admin/courses/${selectedCourse}/modules/${selectedModule}/lessons`
    )
      .then((res) => res.json())
      .then(setLessons)
      .catch(console.error);

    setSelectedLesson("");
  }, [selectedCourse, selectedModule]);

  const handleChangeQuestion = (
    index: number,
    field: keyof QuizQuestion,
    value: string | number | string[]
  ) => {
    setQuestions((prev) => {
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
      if (
        !q.question ||
        !q.answer ||
        (q.type === "QCM" && q.options.some((o) => !o))
      ) {
        return alert(`Veuillez remplir correctement la question ${i + 1}`);
      }
    }

    try {
      const res = await fetch(
        `/api/admin/courses/${selectedCourse}/modules/${selectedModule}/lessons/${selectedLesson}/quizzes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, questions }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur création du quiz");
      }

      alert("Quiz créé avec succès !");
      setTitle("");
      setQuestions(INITIAL_QUESTIONS);
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl p-6 bg-white rounded shadow space-y-6"
    >
      {/* ===== Sélecteurs ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-bold">Cours</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">-- Sélectionner un cours --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-bold">Module</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">-- Sélectionner un module --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-bold">Leçon</label>
          <select
            className="w-full border px-2 py-2 rounded focus:ring-2 focus:ring-yellow-400"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            disabled={!selectedModule}
          >
            <option value="">-- Sélectionner une leçon --</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
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
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* ===== Questions ===== */}
      {questions.map((q, i) => (
        <div key={i} className="border p-4 rounded space-y-3 bg-gray-50">
          <h3 className="font-semibold text-lg text-blue-800">Question {i + 1}</h3>

          <input
            type="text"
            placeholder="Question"
            className="w-full border px-3 py-2 rounded font-medium"
            value={q.question}
            onChange={(e) =>
              handleChangeQuestion(i, "question", e.target.value)
            }
            required
          />

          <select
            className="w-full border px-2 py-2 rounded bg-white"
            value={q.type}
            onChange={(e) =>
              handleChangeQuestion(i, "type", e.target.value as QuizType)
            }
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "TEXT" ? "Texte" : "QCM"}
              </option>
            ))}
          </select>

          {q.type === "QCM" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-2 border-l-2 border-blue-400">
              {q.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  className="w-full border px-2 py-1.5 rounded bg-white"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...q.options];
                    newOpts[idx] = e.target.value;
                    handleChangeQuestion(i, "options", newOpts);
                  }}
                  required
                />
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Bonne Réponse :
              </label>
              <input
                type="text"
                placeholder="Réponse exacte"
                className="w-full border px-2 py-2 rounded bg-green-50 border-green-300 font-semibold"
                value={q.answer}
                onChange={(e) =>
                  handleChangeQuestion(i, "answer", e.target.value)
                }
                required
              />
            </div>

            <div className="w-32">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Points :
              </label>
              <input
                type="number"
                placeholder="Points"
                className="w-full border px-2 py-2 rounded bg-white"
                value={q.points}
                onChange={(e) =>
                  handleChangeQuestion(
                    i,
                    "points",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold px-6 py-3 rounded mt-4 hover:bg-blue-700 transition-colors shadow"
      >
        Créer le quiz
      </button>
    </form>
  );
}