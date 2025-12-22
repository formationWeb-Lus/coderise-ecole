import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LessonDetailPageProps {
  params: Promise<{ lessonId: string }>; // Next.js 16 App Router
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { lessonId } = await params; // 🔹 Déstructuration après await
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);
  const lessonIdNumber = Number(lessonId);

  // 🔹 Récupération de la leçon avec tous les exercices et devoirs soumis
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonIdNumber },
    include: {
      exercises: {
        include: {
          submissions: {
            where: { userId },
          },
        },
      },
      assignmentSubmissions: {
        where: { userId },
      },
    },
  });

  if (!lesson) return <div>Leçon non trouvée</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Informations de la leçon */}
      <h1 className="text-3xl font-bold">{lesson.title}</h1>
      {lesson.description && <p className="text-gray-600">{lesson.description}</p>}
      {lesson.videoUrl && (
        <div className="mt-4">
          <video src={lesson.videoUrl} controls className="w-full rounded-lg" />
        </div>
      )}
      {lesson.pdfUrl && (
        <p className="mt-2">
          PDF:{" "}
          <a href={lesson.pdfUrl} target="_blank" className="text-blue-600">
            Télécharger
          </a>
        </p>
      )}

      {/* Exercices */}
      <div>
        <h2 className="text-2xl font-semibold mt-4">Exercices</h2>
        {lesson.exercises.length === 0 && <p>Aucun exercice</p>}
        {lesson.exercises.map((ex) => {
          const sub = ex.submissions[0];
          return (
            <div key={ex.id} className="p-4 border rounded-lg mb-2">
              <p className="font-semibold">{ex.question}</p>
              <p>Points: {ex.points}</p>
              <p>
                Votre réponse: {sub ? sub.answer : "Non soumis"}{" "}
                {sub && sub.answer === ex.answer ? "✅ Correct" : sub ? "❌ Incorrect" : ""}
              </p>
              <p>Score: {sub?.score ?? 0}</p>
              <p>Status: {sub?.status ?? "PENDING"}</p>
              {sub?.submittedAt && <p>Soumis le: {sub.submittedAt.toLocaleDateString()}</p>}
            </div>
          );
        })}
      </div>

      {/* Devoirs */}
      <div>
        <h2 className="text-2xl font-semibold mt-4">Devoirs</h2>
        {lesson.assignmentSubmissions.length === 0 && <p>Aucun devoir soumis</p>}
        {lesson.assignmentSubmissions.map((a) => (
          <div key={a.id} className="p-4 border rounded-lg mb-2">
            <p>
              Fichier:{" "}
              <a href={a.fileUrl} target="_blank" className="text-blue-600">
                {a.fileUrl}
              </a>
            </p>
            <p>Score: {a.score ?? 0} / 100</p>
            <p>Status: {a.status}</p>
            {a.feedback && <p>Feedback: {a.feedback}</p>}
            {a.studentComment && <p>Commentaire: {a.studentComment}</p>}
            <p>Soumis le: {a.createdAt.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
