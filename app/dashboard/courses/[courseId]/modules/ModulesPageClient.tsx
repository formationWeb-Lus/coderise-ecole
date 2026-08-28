"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lesson {
  id: string | number;
  title: string;
}

interface Module {
  id: string | number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Props {
  courseId: string;
}

export default function ModulesPageClient({ courseId }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  // 🔹 États pour la modification du module
  const [editingModuleId, setEditingModuleId] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    fetch(`/api/admin/courses/${courseId}/modules`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setModules(data);
      })
      .catch((err) => console.error("Erreur fetch modules :", err))
      .finally(() => setLoading(false));
  }, [courseId]);

  // 🔹 Modifier le nom du module (API PUT)
  const handleSaveModule = async (moduleId: string | number) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });

      if (!res.ok) throw new Error("Erreur modification module");

      const updatedModule = await res.json();
      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, title: updatedModule.title } : m))
      );
      setEditingModuleId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement des modules...</div>;
  if (!modules.length) return <div className="p-4 text-center">Aucun module trouvé.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Modules (Cours #{courseId})</h1>

      {modules.map((module, index) => {
        const weekNumber = index + 1;
        const isOpen = openWeek === index;
        const isEditing = editingModuleId === module.id;

        return (
          <div key={module.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
            {/* Header / Barre du Module */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 transition">
              {isEditing ? (
                /* Mode Édition */
                <div className="flex items-center space-x-2 flex-grow mr-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border rounded px-3 py-1 flex-grow text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSaveModule(module.id)}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingModuleId(null)}
                    className="bg-gray-400 hover:bg-gray-500 text-white text-xs px-3 py-1.5 rounded"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                /* Mode Affichage */
                <button
                  onClick={() => setOpenWeek(isOpen ? null : index)}
                  className="flex-grow text-left font-semibold flex items-center justify-between"
                >
                  <span>{`Semaine ${weekNumber} - ${module.title}`}</span>
                  <span className="text-xl ml-2">{isOpen ? "▲" : "▼"}</span>
                </button>
              )}

              {/* Bouton pour déclencher l'édition du titre du module */}
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditingModuleId(module.id);
                    setEditTitle(module.title);
                  }}
                  className="ml-4 text-xs bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded"
                >
                  ✏️ Éditer le nom
                </button>
              )}
            </div>

            {/* Accordéon avec Liste des Leçons et Bouton de Modification */}
            {isOpen && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-700">Leçons du module :</h3>

                  {/* 🔹 BOUTON DYNAMIQUE POUR GERER / MODIFIER LES LEÇONS DE CE MODULE */}
                  <Link
                    href={`/dashboard/admin/courses/${courseId}/modules/${module.id}/lessons`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded font-medium shadow-sm"
                  >
                    ⚙️ Gérer / Modifier les leçons →
                  </Link>
                </div>

                {module.lessons && module.lessons.length > 0 ? (
                  <ul className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="p-2 bg-white rounded border flex justify-between items-center text-sm"
                      >
                        <span>{lesson.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500 italic">Aucune leçon dans ce module.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}