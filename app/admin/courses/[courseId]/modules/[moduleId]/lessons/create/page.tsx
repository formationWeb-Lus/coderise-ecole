"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLessonPage({ params }: any) {
  const { courseId, moduleId } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/admin/modules/${moduleId}/lessons`, {
      method: "POST",
      body: JSON.stringify({ title, order, content, videoUrl, pdfUrl }),
    });

    router.push(`/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Créer une leçon</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          className="border p-2 w-full"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Ordre"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Lien vidéo"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Lien PDF"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Créer
        </button>
      </form>
    </div>
  );
}
