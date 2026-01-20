"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Upload, FileText } from "lucide-react";


interface Props {
  userId: number;
  lessonId: number;
}


export default function AssignmentClient({ userId }: Props) {
  const params = useParams();
  const lessonId = Number(params?.lessonId);

  if (!lessonId || isNaN(lessonId)) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Leçon invalide ou introuvable
      </div>
    );
  }

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

    if (!["application/pdf", "application/zip"].includes(file.type)) {
      setMessage("Seuls les fichiers PDF ou ZIP sont autorisés.");
      setError(true);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Le fichier dépasse 10 Mo.");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      // 🔹 Convertir le fichier en Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64Data = (reader.result as string).split(",")[1];

        // 🔹 Envoyer au backend en JSON
        const saveRes = await fetch("/api/assignments/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            comment,
            fileBase64: base64Data,
            fileName: file.name,
            fileType: file.type,
          }),
        });

        const data = await saveRes.json();

        if (!saveRes.ok) {
          setMessage(data.error || "Erreur lors de la soumission.");
          setError(true);
        } else {
          setMessage("✅ Devoir soumis avec succès !");
          setFile(null);
          setComment("");
        }

        setLoading(false);
      };

      reader.onerror = () => {
        setMessage("Erreur lors de la lecture du fichier.");
        setError(true);
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setMessage("Erreur réseau.");
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-yellow-50 border border-yellow-200 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-yellow-900 mb-2">
          Soumettre le devoir
        </h1>

        <p className="text-gray-700 mb-6 text-lg">
          Téléversez votre travail final et ajoutez un commentaire si nécessaire.
        </p>

        <label className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-yellow-400 rounded-lg cursor-pointer bg-yellow-100 hover:bg-yellow-200 transition">
          <Upload className="w-6 h-6" />
          <span className="font-semibold">Importer un fichier</span>
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

        <textarea
          className="w-full min-h-30 mt-4 p-3 rounded border border-yellow-300 focus:ring-2 focus:ring-yellow-400"
          placeholder="Commentaire pour le formateur (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Soumission..." : "Envoyer le devoir"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
