"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCourse() {
  const router = useRouter();

  const params = useParams<{ courseId: string }>();

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [duration, setDuration] = useState("");

  const [id, setId] = useState<number>();
  const [createdAt, setCreatedAt] = useState("");

  const [modules, setModules] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!courseId) return;

    async function loadCourse() {
      setLoading(true);

      const res = await fetch(`/api/admin/courses/${courseId}`, {
  cache: "no-store",
});

      if (!res.ok) {
        alert("Impossible de charger le cours.");
        setLoading(false);
        return;
      }

      const course = await res.json();

      setId(course.id);
      setTitle(course.title);
      setDescription(course.description);
      setImageUrl(course.imageUrl ?? "");
      setDuration(String(course.duration));
      setCreatedAt(course.createdAt);

      setModules(course.modules ?? []);
      setAnnouncements(course.announcements ?? []);
      setPayments(course.payments ?? []);
      setStudents(course.studentCourses ?? []);

      setLoading(false);
    }

    loadCourse();
  }, [courseId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/admin/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        duration: Number(duration),
      }),
    });

    if (res.ok) {
      alert("Cours modifié avec succès.");
      router.push("/dashboard/admin/courses");
    } else {
      alert("Erreur lors de la modification.");
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Modifier le cours
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">

        <div className="border rounded p-4">
          <strong>ID :</strong> {id}
        </div>

        <div className="border rounded p-4">
          <strong>Date de création :</strong><br />
          {new Date(createdAt).toLocaleString()}
        </div>

        <div className="border rounded p-4">
          <strong>Modules :</strong> {modules.length}
        </div>

        <div className="border rounded p-4">
          <strong>Annonces :</strong> {announcements.length}
        </div>

        <div className="border rounded p-4">
          <strong>Paiements :</strong> {payments.length}
        </div>

        <div className="border rounded p-4">
          <strong>Étudiants inscrits :</strong> {students.length}
        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="font-semibold block mb-2">
            Titre
          </label>

          <input
            className="border rounded w-full p-3"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Description
          </label>

          <textarea
            className="border rounded w-full p-3 h-40"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Image URL
          </label>

          <input
            className="border rounded w-full p-3"
            value={imageUrl}
            onChange={(e)=>setImageUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">
            Durée (heures)
          </label>

          <input
            type="number"
            className="border rounded w-full p-3"
            value={duration}
            onChange={(e)=>setDuration(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          Enregistrer les modifications
        </button>

      </form>

    </div>
  );
}