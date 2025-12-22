"use client"; // obligatoire pour useState et interactions côté client

import React, { useState } from "react";

interface SubmissionCorrectionFormProps {
  submissionId: number;
  currentStatus: string;
  currentScore?: number;
  currentFeedback?: string;
}

export default function SubmissionCorrectionForm({
  submissionId,
  currentStatus,
  currentScore = 0,
  currentFeedback = "",
}: SubmissionCorrectionFormProps) {
  const [score, setScore] = useState<number>(currentScore);
  const [feedback, setFeedback] = useState<string>(currentFeedback);
  const [status, setStatus] = useState<string>(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/submissions/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: submissionId, score, feedback, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur inconnue");
      }

      alert("Soumission mise à jour !");
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la mise à jour : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Correction</h2>

      <div className="mb-2">
        <label className="block font-medium">Score</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border p-1 rounded w-20"
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="PENDING">PENDING</option>
          <option value="GRADED">GRADED</option>
          <option value="LATE">LATE</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
