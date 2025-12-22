"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditCoursePage({ params }: any) {
  const { id } = params;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/admin/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
      }),
    });

    router.push("/dashboard/admin/courses");
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modifier le cours #{id}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          className="border p-2 w-full"
          placeholder="Titre du cours"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={course.description}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={course.imageUrl || ""}
          onChange={(e) =>
            setCourse({ ...course, imageUrl: e.target.value })
          }
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
