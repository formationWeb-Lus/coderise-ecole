"use client";

import { useEffect, useState } from "react";

interface Lesson {
  id: number;
  title: string;
  order: number;
  content?: string;
  videoUrl?: string | null;
  pdfUrl?: string | null;
}

interface Props {
  params: Promise<{ courseId: string; moduleId: string }>;
}

export default function LessonsPageClient({ params }: Props) {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Édition
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 1. Résolution de la promesse params
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setCourseId(resolved.courseId);
      setModuleId(resolved.moduleId);
    };
    resolveParams();
  }, [params]);

  // 🔹 2. Fetch des leçons
  const fetchLessons = async () => {
    if (!courseId || !moduleId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons`
      );

      let data: any = [];
      try {
        data = await res.json();
      } catch {
        data = [];
      }

      if (!res.ok) throw new Error(data?.error || `Erreur HTTP ${res.status}`);
      if (!Array.isArray(data)) data = [];
      setLessons(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
      console.error("Erreur fetch lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId, moduleId]);

  // 🔹 3. Supprimer une leçon
  const handleDelete = async (lessonId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette leçon ?")) return;

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 🔹 4. Modifier une leçon (PUT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${editingLesson.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editingLesson.title,
            order: Number(editingLesson.order),
            content: editingLesson.content || "",
            videoUrl: editingLesson.videoUrl || null,
            pdfUrl: editingLesson.pdfUrl || null,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la modification");
      }

      const updated: Lesson = await res.json();

      setLessons((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      setEditingLesson(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Chargement des leçons...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur : {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Leçons du module {moduleId} (cours {courseId})
      </h2>

      <table className="min-w-full border bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Titre</th>
            <th className="border px-4 py-2 text-left">Ordre</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.length === 0 ? (
            <tr>
              <td colSpan={4} className="border px-4 py-4 text-center text-gray-500">
                Aucune leçon disponible pour ce module.
              </td>
            </tr>
          ) : (
            lessons.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{l.id}</td>
                <td className="border px-4 py-2 font-medium">{l.title}</td>
                <td className="border px-4 py-2">{l.order}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => setEditingLesson(l)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔹 Modal de Modification */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              Modifier la Leçon #{editingLesson.id}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ordre</label>
                <input
                  type="number"
                  required
                  value={editingLesson.order}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      order: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contenu</label>
                <textarea
                  rows={3}
                  value={editingLesson.content || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, content: e.target.value })
                  }
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lien Vidéo (optionnel)</label>
                <input
                  type="text"
                  value={editingLesson.videoUrl || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, videoUrl: e.target.value })
                  }
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* 🔹 Champ PDF Ajouté */}
              <div>
                <label className="block text-sm font-medium mb-1">Lien PDF (optionnel)</label>
                <input
                  type="text"
                  value={editingLesson.pdfUrl || ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, pdfUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}