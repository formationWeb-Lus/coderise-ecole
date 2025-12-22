"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function AssignmentPage() {
  const params = useParams();

  const lessonId = Number(params.lessonId);
  const courseId = params.courseId as string;
  const week = params.week as string;

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return setMessage("Veuillez sélectionner un fichier");
    if (!userId) return setMessage("Vous devez être connecté pour soumettre");
    if (isNaN(lessonId)) return setMessage("lessonId invalide");

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
        setMessage("Devoir soumis avec succès !");
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Soumettre le devoir</h1>
      <p className="mb-6">
        Vous allez envoyer votre devoir pour la leçon <strong>#{lessonId}</strong>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block mb-2 font-semibold">Fichier du devoir</label>
          <input
            type="file"
            accept=".pdf,.zip,.doc,.docx,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Message (optionnel)</label>
          <textarea
            name="message"
            rows={4}
            className="border p-2 rounded w-full"
            placeholder="Ajouter un message avec votre devoir..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Soumission..." : "Envoyer le devoir"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
