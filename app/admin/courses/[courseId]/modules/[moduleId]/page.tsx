"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditModulePage({ params }: any) {
  const { courseId, moduleId } = params;
  const router = useRouter();

  const [moduleData, setModuleData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`)
      .then((res) => res.json())
      .then((data) => setModuleData(data));
  }, [courseId, moduleId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(
      `/api/admin/courses/${courseId}/modules/${moduleId}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: moduleData.title,
          order: moduleData.order,
        }),
      }
    );

    router.push(`/dashboard/admin/courses/${courseId}/modules`);
  };

  if (!moduleData) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Modifier le module #{moduleId}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          className="border p-2 w-full"
          value={moduleData.title}
          onChange={(e) =>
            setModuleData({ ...moduleData, title: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          type="number"
          value={moduleData.order}
          onChange={(e) =>
            setModuleData({ ...moduleData, order: Number(e.target.value) })
          }
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
