"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  title: string;
}

export default function CreateModuleForm() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Charger tous les cours disponibles
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/admin/courses");
        const data: Course[] = await res.json();
        setCourses(data);

        if (data.length > 0) {
          setSelectedCourseId(data[0].id); // sélectionner par défaut le premier cours
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les cours");
      }
    }
    loadCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCourseId) {
      setError("Veuillez sélectionner un cours");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/courses/${selectedCourseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          order,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur création module");

      router.push(`/dashboard/admin/courses/${selectedCourseId}/modules`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Ajouter un module</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 🔹 Sélection du cours */}
        <div>
          <label className="block mb-1 font-semibold">Cours</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            required
          >
            <option value="">-- Sélectionnez un cours --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Titre du module */}
        <div>
          <label className="block mb-1 font-semibold">Titre du module</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 🔹 Ordre */}
        <div>
          <label className="block mb-1 font-semibold">Ordre</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>

        {/* 🔹 Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer le module"}
        </button>
      </form>
    </div>
  );
}
