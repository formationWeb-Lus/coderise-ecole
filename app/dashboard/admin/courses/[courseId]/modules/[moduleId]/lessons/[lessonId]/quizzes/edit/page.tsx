"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface DbQuestion {
  id: number;
  quizId: number;
  question: string;
  type: "QCM" | "BOOLEAN" | "TEXT";
  options: string; // Exemple BDD: '["A. Option 1", "B. Option 2"]' ou '["","","",""]'
  answer: string;  // Exemple BDD: "Vrai" ou "B. Visual Studio Code"
  points: number;
}

interface FormOption {
  text: string;
  isCorrect: boolean;
}

interface FormQuestion {
  id?: number;
  question: string;
  type: "QCM" | "BOOLEAN" | "TEXT";
  options: FormOption[];
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  questions: DbQuestion[];
}

interface Props {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export default function EditQuizPage({ params }: Props) {
  const { courseId, moduleId, lessonId } = use(params);
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [questions, setQuestions] = useState<FormQuestion[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les quiz depuis la BDD
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(
          `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`
        );
        if (!res.ok) throw new Error("Erreur lors du chargement du quiz");
        const data: Quiz[] = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setQuizzes(data);
          selectQuiz(data[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [courseId, moduleId, lessonId]);

  // Convertir les questions de la BDD vers le formulaire
  const selectQuiz = (quiz: Quiz) => {
    setSelectedQuizId(quiz.id);
    setQuizTitle(quiz.title);

    const formattedQuestions: FormQuestion[] = quiz.questions.map((q) => {
      let rawOptions: string[] = [];
      try {
        rawOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options || [];
      } catch {
        rawOptions = [];
      }

      // CORRECTION BOOLEAN : Si c'est BOOLEAN ou si les options sont vides
      if (q.type === "BOOLEAN" || rawOptions.length === 0 || rawOptions.every((o) => o === "")) {
        if (q.type === "BOOLEAN") {
          rawOptions = ["Vrai", "Faux"];
        }
      }

      // Reconstruire les options et cocher celle correspondant au champ `answer`
      const optionsWithCorrectness: FormOption[] = rawOptions.map((optText) => ({
        text: optText,
        isCorrect: optText.trim().toLowerCase() === (q.answer || "").trim().toLowerCase(),
      }));

      return {
        id: q.id,
        question: q.question,
        type: q.type || "QCM",
        options: optionsWithCorrectness,
        points: q.points || 5,
      };
    });

    setQuestions(formattedQuestions);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const found = quizzes.find((q) => q.id === id);
    if (found) selectQuiz(found);
  };

  const handleQuestionChange = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].question = text;
    setQuestions(updated);
  };

  const handlePointsChange = (index: number, points: number) => {
    const updated = [...questions];
    updated[index].points = points;
    setQuestions(updated);
  };

  const handleTypeChange = (index: number, type: "QCM" | "BOOLEAN" | "TEXT") => {
    const updated = [...questions];
    updated[index].type = type;
    if (type === "BOOLEAN") {
      updated[index].options = [
        { text: "Vrai", isCorrect: true },
        { text: "Faux", isCorrect: false },
      ];
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = text;
    setQuestions(updated);
  };

  const toggleCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex,
    }));
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "QCM",
        points: 5,
        options: [
          { text: "A. ", isCorrect: true },
          { text: "B. ", isCorrect: false },
          { text: "C. ", isCorrect: false },
          { text: "D. ", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, idx) => idx !== oIndex);
    setQuestions(updated);
  };

  // Sauvegarde
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuizId) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/quizzes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: selectedQuizId,
            title: quizTitle,
            questions,
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde du quiz");

      alert("Quiz mis à jour avec succès !");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement du quiz...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Modification & Correction du Quiz</h1>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>}

      {/* Sélecteur de Quiz */}
      <div className="p-4 bg-gray-50 border rounded-lg space-y-2">
        <label className="block text-sm font-medium text-gray-700">Sélectionner un Quiz :</label>
        <select
          value={selectedQuizId || ""}
          onChange={handleSelectChange}
          className="w-full border p-2 rounded outline-none bg-white"
        >
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title} (ID: {quiz.id})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div className="p-4 bg-white border rounded-lg shadow-sm space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Titre du Quiz</label>
          <input
            type="text"
            required
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Liste des questions */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">Question {qIndex + 1}</span>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 text-sm hover:underline"
              >
                Supprimer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Intitulé de la question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  className="w-full border p-2 rounded outline-none"
                />
              </div>

              <div className="flex space-x-2">
                <select
                  value={q.type}
                  onChange={(e) => handleTypeChange(qIndex, e.target.value as any)}
                  className="border p-2 rounded bg-white text-sm"
                >
                  <option value="QCM">QCM</option>
                  <option value="BOOLEAN">BOOLEAN</option>
                </select>

                <input
                  type="number"
                  min="1"
                  value={q.points}
                  onChange={(e) => handlePointsChange(qIndex, Number(e.target.value))}
                  className="w-20 border p-2 rounded text-sm text-center"
                  placeholder="Points"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 pl-4 border-l-2 border-purple-300">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Options (Cochez le bouton radio pour définir la bonne réponse)
              </label>

              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={opt.isCorrect}
                    onChange={() => toggleCorrectOption(qIndex, oIndex)}
                    className="w-4 h-4 text-purple-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    readOnly={q.type === "BOOLEAN"}
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    className={`flex-grow border p-1.5 rounded text-sm ${
                      opt.isCorrect ? "border-green-500 bg-green-50 font-semibold" : ""
                    } ${q.type === "BOOLEAN" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  {q.type === "QCM" && q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-red-400 text-xs px-1 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {q.type === "QCM" && (
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-xs text-purple-600 font-semibold hover:underline mt-2 block"
                >
                  + Ajouter une option
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-medium"
          >
            + Ajouter une question
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}