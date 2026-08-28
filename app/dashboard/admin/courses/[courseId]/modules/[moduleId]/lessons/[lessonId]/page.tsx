"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lesson {
  id: number;
  moduleId: number;
  order: number;
  title: string;
  content: string;
  videoUrl: string | null;
  pdfUrl: string | null;
  description?: string | null;
  videoDescription?: string | null;
}

interface Props {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>;
}

export default function EditLessonPage({ params }: Props) {
  const router = useRouter();

  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);

  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // 1. RÉCUPÉRER LES PARAMÈTRES
  // =========================================================

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;

        setCourseId(resolved.courseId);
        setModuleId(resolved.moduleId);
        setLessonId(resolved.lessonId);
      } catch (error) {
        console.error("Erreur params :", error);
        setError("Impossible de récupérer les paramètres.");
      }
    };

    resolveParams();
  }, [params]);

  // =========================================================
  // 2. CHARGER LA LEÇON
  // =========================================================

  useEffect(() => {
    if (!courseId || !moduleId || !lessonId) {
      return;
    }

    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Impossible de récupérer la leçon."
          );
        }

        setLesson(data);
      } catch (error: any) {
        console.error("Erreur chargement leçon :", error);

        setError(
          error?.message || "Une erreur est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, moduleId, lessonId]);

  // =========================================================
  // 3. MODIFIER UN CHAMP
  // =========================================================

  const updateLesson = <K extends keyof Lesson>(
    field: K,
    value: Lesson[K]
  ) => {
    setLesson((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  // =========================================================
  // 4. ENREGISTRER
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!lesson || !courseId || !moduleId || !lessonId) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        title: lesson.title,
        order: Number(lesson.order),
        content: lesson.content || "",
        videoUrl: lesson.videoUrl?.trim() || null,
        pdfUrl: lesson.pdfUrl?.trim() || null,
        description: lesson.description?.trim() || null,
        videoDescription:
          lesson.videoDescription?.trim() || null,
      };

      console.log("Données envoyées :", payload);

      const response = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Erreur lors de l'enregistrement de la leçon."
        );
      }

      console.log("Leçon mise à jour :", data);

      // Redirection vers la liste des leçons
      router.push(
        `/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`
      );

      router.refresh();
    } catch (error: any) {
      console.error("Erreur sauvegarde :", error);

      setError(
        error?.message ||
          "Une erreur est survenue pendant l'enregistrement."
      );

      alert(
        error?.message ||
          "Erreur lors de l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // 5. ÉTATS DE CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-3xl mb-3">⏳</div>

          <p className="text-gray-600">
            Chargement de la leçon...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // 6. ERREUR
  // =========================================================

  if (error && !lesson) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-700 mb-2">
            Une erreur est survenue
          </h2>

          <p className="text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // 7. LEÇON INTROUVABLE
  // =========================================================

  if (!lesson) {
    return (
      <div className="p-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gray-600">
            Leçon introuvable.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // 8. AFFICHAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline mb-3"
          >
            ← Retour aux leçons
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Modifier la leçon
          </h1>

          <p className="text-gray-500 mt-1">
            Leçon #{lesson.id}
          </p>
        </div>

        {/* ERREUR DE SAUVEGARDE */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
        >

          {/* TITRE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Titre de la leçon
            </label>

            <input
              type="text"
              required
              value={lesson.title}
              onChange={(event) =>
                updateLesson(
                  "title",
                  event.target.value
                )
              }
              placeholder="Ex : Créer un repository GitHub"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ORDRE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ordre de la leçon
            </label>

            <input
              type="number"
              required
              min="1"
              value={lesson.order}
              onChange={(event) =>
                updateLesson(
                  "order",
                  Number(event.target.value)
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CONTENU */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenu de la leçon
            </label>

            <textarea
              required
              rows={12}
              value={lesson.content}
              onChange={(event) =>
                updateLesson(
                  "content",
                  event.target.value
                )
              }
              placeholder="Écrivez le contenu de votre leçon..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              rows={4}
              value={lesson.description ?? ""}
              onChange={(event) =>
                updateLesson(
                  "description",
                  event.target.value
                )
              }
              placeholder="Description de la leçon..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* VIDEO */}
          <div className="border rounded-xl p-5 bg-gray-50">
            <h2 className="font-semibold text-lg mb-4">
              🎥 Vidéo
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la vidéo
            </label>

            <input
              type="url"
              value={lesson.videoUrl ?? ""}
              onChange={(event) =>
                updateLesson(
                  "videoUrl",
                  event.target.value
                )
              }
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />

            {lesson.videoUrl && (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-blue-600 hover:underline text-sm"
              >
                ▶️ Ouvrir la vidéo
              </a>
            )}
          </div>

          {/* PDF */}
          <div className="border rounded-xl p-5 bg-gray-50">
            <h2 className="font-semibold text-lg mb-4">
              📄 Document PDF
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du PDF
            </label>

            <input
              type="url"
              value={lesson.pdfUrl ?? ""}
              onChange={(event) =>
                updateLesson(
                  "pdfUrl",
                  event.target.value
                )
              }
              placeholder="https://example.com/mon-cours.pdf"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* PDF ACTUEL */}
            {lesson.pdfUrl && (
              <div className="mt-4 p-4 bg-white border rounded-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      📄 PDF disponible
                    </p>

                    <p className="text-sm text-gray-500 break-all mt-1">
                      {lesson.pdfUrl}
                    </p>
                  </div>

                  <a
                    href={lesson.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Ouvrir
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPTION VIDEO */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description de la vidéo
            </label>

            <textarea
              rows={3}
              value={lesson.videoDescription ?? ""}
              onChange={(event) =>
                updateLesson(
                  "videoDescription",
                  event.target.value
                )
              }
              placeholder="Description de la vidéo..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* BOUTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
            >
              {saving
                ? "Enregistrement..."
                : "💾 Enregistrer les modifications"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}