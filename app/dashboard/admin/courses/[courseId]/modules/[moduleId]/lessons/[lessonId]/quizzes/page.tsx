// /dashboard/admin/courses/[courseId]/modules/[moduleId]/lesson/[lessonId]/quizzes/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateQuizForm from "./CreateQuizForm";

interface PageParams {
  courseId: string;
  moduleId: string;
  lessonId: string;
}

interface PageProps {
  params: PageParams;
}

export default async function QuizPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { courseId, moduleId, lessonId } = params;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Créer un quiz pour la leçon {lessonId}
      </h1>

      <CreateQuizForm courseId={courseId} moduleId={moduleId} lessonId={lessonId} />
    </div>
  );
}
