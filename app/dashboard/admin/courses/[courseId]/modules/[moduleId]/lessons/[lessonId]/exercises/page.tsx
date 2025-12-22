"use client";

import { useParams } from "next/navigation";
import CreateExerciseForm from "./CreateExerciseForm";

export default function CreateExercisePage() {
  const params = useParams();
  const { courseId, moduleId, lessonId } = params as {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };

  if (!courseId || !moduleId || !lessonId) {
    return (
      <div className="p-6 text-red-600">
        courseId, moduleId ou lessonId manquant
      </div>
    );
  }

  return (
    <CreateExerciseForm
      courseId={courseId}
      moduleId={moduleId}
      lessonId={lessonId}
    />
  );
}
