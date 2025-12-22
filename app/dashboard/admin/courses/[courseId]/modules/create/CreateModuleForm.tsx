"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateModuleFormProps {
  courseId: string;
}

export default function CreateModuleForm({
  courseId,
}: CreateModuleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId, // ✅ EXPLICITE
            title,
            order,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur création module");
      }

      router.push(`/dashboard/admin/courses/${courseId}/modules`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        Ajouter un module au cours {courseId}
      </h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ courseId visible mais non modifiable */}
        <div>
          <label className="block mb-1">Course ID</label>
          <input
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={courseId}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1">Titre du module</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Ordre</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>

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
