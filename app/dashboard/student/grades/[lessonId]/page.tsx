import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LessonDetailPageProps {
  params: { lessonId: string };
}

export default async function LessonDetailPage({
  params,
}: LessonDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/auth/signin");
  if (session.user.role !== "STUDENT") redirect("/dashboard");

  const userId = Number(session.user.id);
  const lessonIdNumber = Number(params.lessonId);

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

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600 font-semibold">
        Leçon non trouvée
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* HEADER */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow">
        <h1 className="text-3xl font-bold text-yellow-900">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="mt-3 text-lg text-gray-700">
            {lesson.description}
          </p>
        )}
      </div>

      {/* VIDEO */}
      {lesson.videoUrl && (
        <div className="bg-white border rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-3">
            Vidéo de la leçon
          </h2>

          <video
            src={lesson.videoUrl}
            controls
            className="w-full rounded-lg border"
          />
        </div>
      )}

      {/* PDF */}
      {lesson.pdfUrl && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="font-semibold text-gray-700">
            Ressource PDF :
          </p>

          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-semibold underline hover:text-green-900"
          >
            Télécharger le document
          </a>
        </div>
      )}

      {/* EXERCICES */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-900">
          Exercices
        </h2>

        {lesson.exercises.length === 0 && (
          <p className="text-gray-600">
            Aucun exercice pour cette leçon.
          </p>
        )}

        {lesson.exercises.map((ex) => {
          const sub = ex.submissions[0];
          const isCorrect = sub ? sub.answer === ex.answer : false;

          return (
            <div
              key={ex.id}
              className="p-5 rounded-xl border shadow bg-white"
            >
              <p className="font-semibold text-lg">
                {ex.question}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Points : {ex.points}
              </p>

              <div className="mt-3 space-y-1">
                <p>
                  <span className="font-semibold">
                    Votre réponse :
                  </span>{" "}
                  {sub?.answer ?? "Non soumis"}
                </p>

                {sub && (
                  <p
                    className={`font-semibold ${
                      isCorrect ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {isCorrect
                      ? "✅ Réponse correcte"
                      : "❌ Réponse incorrecte"}
                  </p>
                )}

                <p>
                  <span className="font-semibold">Score :</span>{" "}
                  {sub?.score ?? 0}
                </p>

                <p>
                  <span className="font-semibold">Statut :</span>{" "}
                  {sub?.status ?? "PENDING"}
                </p>

                {sub?.submittedAt && (
                  <p className="text-sm text-gray-500">
                    Soumis le :{" "}
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DEVOIRS */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-900">
          Devoirs soumis
        </h2>

        {lesson.assignmentSubmissions.length === 0 && (
          <p className="text-gray-600">
            Aucun devoir soumis pour cette leçon.
          </p>
        )}

        {lesson.assignmentSubmissions.map((a) => (
          <div
            key={a.id}
            className="p-5 rounded-xl border bg-yellow-50 shadow"
          >
            <p className="font-semibold">Fichier :</p>

            {a.filePath && (
              <a
                href={a.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline font-semibold break-all"
              >
                Télécharger le devoir
              </a>
            )}

            <div className="mt-3 space-y-1 text-gray-700">
              <p>
                <span className="font-semibold">Score :</span>{" "}
                {a.score ?? 0} / 100
              </p>

              <p>
                <span className="font-semibold">Statut :</span>{" "}
                {a.status}
              </p>

              {a.feedback && (
                <p>
                  <span className="font-semibold">
                    Feedback :
                  </span>{" "}
                  {a.feedback}
                </p>
              )}

              {a.studentComment && (
                <p>
                  <span className="font-semibold">
                    Commentaire étudiant :
                  </span>{" "}
                  {a.studentComment}
                </p>
              )}

              <p className="text-sm text-gray-500">
                Soumis le :{" "}
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
