"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
}

export default function EditModulePage({ params }: Props) {
  // Dépaquetage des paramètres pour Next.js 15
  const { courseId, moduleId } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 1. Charger les données actuelles du module
  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(
          `/api/admin/courses/${courseId}/modules/${moduleId}`
        );
        if (!res.ok) {
          throw new Error("Impossible de charger les données du module");
        }
        const data = await res.json();
        setTitle(data.title || "");
        setOrder(data.order || 1);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchModule();
  }, [courseId, moduleId]);

  // 🔹 2. Soumettre la modification (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            order: Number(order),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la modification");
      }

      // Redirection vers la liste des leçons ou des modules après succès
      router.push(`/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Chargement du module...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Modifier le Module #{moduleId} (Cours #{courseId})
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm font-medium mb-1">Titre du module</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
          <input
            type="number"
            required
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 1)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}