import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AssignmentClient from "./AssignmentClient";

interface PageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function AssignmentPage({ params }: PageProps) {
  // ✅ OBLIGATOIRE AVEC NEXT 16
  const { lessonId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const numericLessonId = Number(lessonId);
  const userId = Number(session.user.id);

  if (isNaN(numericLessonId)) {
    return <div className="p-4 text-red-600">Leçon invalide</div>;
  }

  return (
    <AssignmentClient
      lessonId={numericLessonId}
      userId={userId}
    />
  );
}
