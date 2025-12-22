"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateModulePage({ params }: any) {
  const { courseId } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      body: JSON.stringify({ title, order }),
    });

    router.push(`/dashboard/admin/courses/${courseId}/modules`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Créer un module</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Titre du module"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Ordre"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Créer
        </button>
      </form>
    </div>
  );
}
