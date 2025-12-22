"use client";

import { useParams } from "next/navigation";
import CreateModuleForm from "./CreateModuleForm";

export default function CreateModulePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  if (!courseId) {
    return <div className="p-6 text-red-600">courseId manquant</div>;
  }

  return <CreateModuleForm courseId={courseId} />;
}
