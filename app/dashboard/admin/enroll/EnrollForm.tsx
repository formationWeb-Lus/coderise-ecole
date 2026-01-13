"use client";

import { useState } from "react";
import { enrollStudent } from "./actions";

export default function EnrollForm({ students, courses }: any) {
  const [studentUserId, setStudentUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await enrollStudent({
        studentUserId: Number(studentUserId),
        courseId: Number(courseId),
      });
      alert("✅ Étudiant inscrit avec succès !");
      setStudentUserId("");
      setCourseId("");
    } catch (err: any) {
      alert(err.message || "❌ Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélection étudiant */}
      <div>
        <label className="block font-medium mb-1">Étudiant</label>
        <select
          required
          value={studentUserId}
          onChange={(e) => setStudentUserId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choisir un étudiant --</option>
          {students.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      {/* Sélection cours */}
      <div>
        <label className="block font-medium mb-1">Cours</label>
        <select
          required
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choisir un cours --</option>
          {courses.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Inscription..." : "Inscrire l'étudiant"}
      </button>
    </form>
  );
}
