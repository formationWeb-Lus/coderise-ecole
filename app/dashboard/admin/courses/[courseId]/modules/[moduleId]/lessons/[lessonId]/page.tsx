"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditLessonPage({ params }: any) {
  const { courseId, moduleId, lessonId } = params;
  const router = useRouter();

  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/modules/${moduleId}/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((data) => setLesson(data));
  }, [moduleId, lessonId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/admin/modules/${moduleId}/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(lesson),
    });

    router.push(`/dashboard/admin/courses/${courseId}/modules/${moduleId}/lessons`);
  };

  if (!lesson) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modifier la leçon #{lessonId}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          className="border p-2 w-full"
          value={lesson.title}
          onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          type="number"
          value={lesson.order}
          onChange={(e) => setLesson({ ...lesson, order: Number(e.target.value) })}
        />

        <textarea
          className="border p-2 w-full"
          value={lesson.content}
          onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          value={lesson.videoUrl ?? ""}
          onChange={(e) => setLesson({ ...lesson, videoUrl: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          value={lesson.pdfUrl ?? ""}
          onChange={(e) => setLesson({ ...lesson, pdfUrl: e.target.value })}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
