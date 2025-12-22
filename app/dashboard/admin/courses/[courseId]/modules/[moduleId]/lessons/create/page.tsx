"use client";

import { useParams } from "next/navigation";
import CreateLessonForm from "./CreateLessonForm";

export default function CreateLessonPage() {
  const params = useParams();

  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  if (!courseId || !moduleId) {
    return (
      <div className="p-6 text-red-600">
        courseId ou moduleId manquant
      </div>
    );
  }

  return (
    <CreateLessonForm
      courseId={courseId}
      moduleId={moduleId}
    />
  );
}
