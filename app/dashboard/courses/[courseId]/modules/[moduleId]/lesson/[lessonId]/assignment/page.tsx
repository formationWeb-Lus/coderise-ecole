"use client";

import AssignmentPage from "./AssignmentPage";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const lessonId = params?.lessonId ? Number(params.lessonId) : undefined;
  const userId = 1; // 🔹 ou récupère depuis session / context

  if (!lessonId || isNaN(lessonId)) {
    return (
      <p className="text-red-600 font-semibold">
        Leçon introuvable ou invalide
      </p>
    );
  }

  return <AssignmentPage lessonId={lessonId} userId={userId} />;
}

