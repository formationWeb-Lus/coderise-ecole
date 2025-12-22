"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateLessonFormProps {
  courseId: string;
  moduleId: string;
}

export default function CreateLessonForm({
  courseId,
  moduleId,
}: CreateLessonFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [order, setOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            moduleId,
            title,
            description: description || null,
            content,
            videoUrl: videoUrl || null,
            pdfUrl: pdfUrl || null,
            order,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur création lesson");
      }

      router.push(
        `/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Créer une leçon</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contexte */}
        <div>
          <label className="block mb-1">Course ID</label>
          <input
            value={courseId}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Module ID</label>
          <input
            value={moduleId}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1">Titre *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Contenu *</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">URL vidéo</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">URL PDF</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Ordre</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            min={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer la leçon"}
        </button>
      </form>
    </div>
  );
}
