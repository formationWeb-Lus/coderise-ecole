"use client";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function AssignmentClient({
  lessonId,
  userId,
}: {
  lessonId: number;
  userId: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId.toString());
    formData.append("userId", userId.toString());
    formData.append("comment", comment);

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const res = await fetch("/api/assignments/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Erreur lors de la soumission.");
        setError(true);
      } else {
        setMessage("✅ Devoir soumis avec succès !");
        setFile(null);
        setComment("");
      }
    } catch {
      setMessage("Erreur réseau.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-900 mb-2">
          Soumettre le devoir
        </h1>

        {/* 👉 Texte ajouté ici */}
        <p className="text-gray-700 mb-6 text-lg">
          Téléversez votre travail final et ajoutez un commentaire si nécessaire.
        </p>

        {/* Upload */}
        <label className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-yellow-400 rounded-lg cursor-pointer bg-yellow-100 hover:bg-yellow-200 transition">
          <Upload className="w-6 h-6" />
          <span className="font-semibold">
            Cliquez ici pour importer votre fichier
          </span>
          <input
            type="file"
            accept=".pdf,.zip"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {file && (
          <p className="mt-2 flex items-center gap-2 text-green-700">
            <FileText className="w-5 h-5" /> {file.name}
          </p>
        )}

        {/* Commentaire */}
        <textarea
          className="w-full min-h-30 mt-4 p-3 rounded border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Commentaire pour le formateur (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition"
        >
          {loading ? "Soumission..." : "Envoyer le devoir"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              error
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

