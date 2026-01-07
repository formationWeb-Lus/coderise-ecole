"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
}

interface CreateLessonFormProps {
  defaultCourseId?: string;
  defaultModuleId?: string;
}

export default function CreateLessonForm({
  defaultCourseId,
  defaultModuleId,
}: CreateLessonFormProps) {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [existingOrders, setExistingOrders] = useState<number[]>([]);

  const [courseId, setCourseId] = useState(defaultCourseId || "");
  const [moduleId, setModuleId] = useState(defaultModuleId || "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [order, setOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger la liste des cours
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/admin/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Erreur récupération des cours", err);
      }
    }
    fetchCourses();
  }, []);

  // Charger les modules quand un cours est sélectionné
  useEffect(() => {
    if (!courseId) {
      setModules([]);
      setModuleId("");
      return;
    }
    async function fetchModules() {
      try {
        const res = await fetch(`/api/admin/courses/${courseId}/modules`);
        const data = await res.json();
        setModules(data);
        setModuleId(data[0]?.id || "");
      } catch (err) {
        console.error("Erreur récupération des modules", err);
      }
    }
    fetchModules();
  }, [courseId]);

  // Charger les ordres existants dans le module sélectionné
  useEffect(() => {
    if (!moduleId) {
      setExistingOrders([]);
      return;
    }
    async function fetchExistingOrders() {
      try {
        const res = await fetch(`/api/admin/modules/${moduleId}/lessons`);
        const data = await res.json();
        const orders = data.map((l: any) => l.order);
        setExistingOrders(orders);
      } catch (err) {
        console.error("Erreur récupération des ordres existants", err);
      }
    }
    fetchExistingOrders();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !moduleId) {
      setError("Veuillez sélectionner un cours et un module.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            moduleId,
            title,
            description: description || null,
            content,
            videoUrl: videoUrl || null,
            pdfUrl: pdfUrl || null,
            order,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur création lesson");

      router.push(
        `/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Créer une leçon</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sélecteur de cours */}
        <div>
          <label className="block mb-1">Cours *</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Sélectionner un cours --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        {/* Sélecteur de module */}
        <div>
          <label className="block mb-1">Module *</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            required
          >
            <option value="">-- Sélectionner un module --</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} (Order: {m.order})
              </option>
            ))}
          </select>
        </div>

        {/* Affichage des ordres existants */}
        {existingOrders.length > 0 && (
          <p className="text-gray-600 text-sm">
            Ordres existants dans ce module : {existingOrders.join(", ")}
          </p>
        )}

        {/* Champs de création */}
        <div>
          <label className="block mb-1">Titre *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Contenu *</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">URL vidéo</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">URL PDF</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Ordre *</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            min={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Création..." : "Créer la leçon"}
        </button>
      </form>
    </div>
  );
}
