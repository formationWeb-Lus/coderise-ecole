"use client";

import { useState } from "react";

export default function AssignmentPage({ lessonId, userId }: { lessonId: number; userId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (!file) return setMessage("Veuillez sélectionner un fichier");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId.toString());
    formData.append("userId", userId.toString());

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/assignments/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Erreur serveur");
      } else {
        setMessage("Fichier soumis avec succès !");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Soumettre le devoir</h1>

      <input type="file" accept=".pdf,.zip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Soumission..." : "Soumettre"}
      </button>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
