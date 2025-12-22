"use client";

import ModulesPageClient from "./ModulesPageClient";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  let courseId: string | undefined;

  if (params) {
    // Si c'est un tableau, prendre le premier élément
    if (Array.isArray(params.courseId)) {
      courseId = params.courseId[0];
    } else {
      courseId = params.courseId;
    }
  }

  if (!courseId) return <div>CourseId manquant</div>;

  return <ModulesPageClient courseId={courseId} />;
}
