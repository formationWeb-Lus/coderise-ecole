"use client";

import { useState } from "react";

export default function AssignmentPage({
  lessonId,
  userId,
}: {
  lessonId: number;
  userId: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Veuillez sélectionner un fichier");
      setError(true);
      return;
    }

    // Validation type et taille
    if (!["application/pdf", "application/zip"].includes(file.type)) {
      setMessage("Seuls PDF ou ZIP sont autorisés");
      setError(true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Fichier trop volumineux (max 10 Mo)");
      setError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lessonId", lessonId.toString());
    formData.append("userId", userId.toString());

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
        setMessage(data.error || "Erreur serveur");
        setError(true);
      } else {
        setMessage("✅ Fichier soumis avec succès !");
        setError(false);
        setFile(null); // reset
      }
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-yellow-50 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-yellow-900">
        Soumettre le devoir
      </h1>

      <input
        type="file"
        accept=".pdf,.zip"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block mb-2"
      />
      {file && <p className="mb-2 font-medium text-green-700">{file.name}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Soumission..." : "Envoyer le devoir"}
      </button>

      {message && (
        <p
          className={`mt-4 font-semibold ${
            error ? "text-red-700" : "text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
