"use client";

import { useState } from "react";

interface Props {
  courses: { id: number; title: string }[];
}

export default function AnnouncementForm({ courses }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !selectedCourseId) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, courseId: selectedCourseId, videoUrl }),
    });

    if (res.ok) {
      setMessage("Annonce créée avec succès !");
      setTitle("");
      setContent("");
      setSelectedCourseId(null);
      setVideoUrl("");
    } else {
      setMessage("Erreur lors de la création de l'annonce");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">Créer une annonce</h1>

      <div>
        <label className="block font-semibold">Cours</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedCourseId ?? ""}
          onChange={(e) => setSelectedCourseId(Number(e.target.value))}
        >
          <option value="">Sélectionner un cours</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full"
          rows={5}
        />
      </div>

      <div>
        <label className="block font-semibold">Lien vidéo (optionnel)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Création..." : "Créer l'annonce"}
      </button>

      {message && <p className="mt-2">{message}</p>}
    </form>
  );
}
