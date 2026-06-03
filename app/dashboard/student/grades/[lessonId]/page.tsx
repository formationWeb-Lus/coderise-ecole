import { prisma } from "@/lib/prisma";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MarkLessonDone from "@/components/MarkLessonDone";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    week: string;
    lessonId: string;
  }>;
}

// 🎥 Composant vidéo
function LessonVideo({ videoUrl }: { videoUrl: string }) {
  const isYouTube = videoUrl.includes("youtu");

  if (isYouTube) {
    let videoId = "";
    if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1];
    } else if (videoUrl.includes("youtube.com/watch?v=")) {
      videoId = new URL(videoUrl).searchParams.get("v") || "";
    }

    return (
      <div className="relative aspect-video w-full mb-6">
        <iframe
          className="absolute inset-0 w-full h-full rounded"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Vidéo de la leçon"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video controls className="w-full rounded mb-6">
      <source src={videoUrl} type="video/mp4" />
      Votre navigateur ne supporte pas la vidéo.
    </video>
  );
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, week, lessonId } = await params;

  const numericId = Number(lessonId);
  if (isNaN(numericId)) {
    return <div className="p-4 text-red-600">ID de leçon invalide.</div>;
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: numericId },
    include: { exercises: true, quizzes: true },
  });

  if (!lesson) {
    return <div className="p-4 text-red-600">Leçon non trouvée</div>;
  }

  // 🔁 Leçons du module (navigation)
  const lessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  const firstExercise = lesson.exercises[0];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* 🔝 TITRE + DEVOIR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-900">{lesson.title}</h1>

        {lesson.order === 5 && (
          <a
            href={`/dashboard/courses/${courseId}/modules/${lesson.moduleId}/lesson/${lesson.id}/assignment`}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Soumettre le devoir
          </a>
        )}
      </div>

      {/* 📝 CONTENU */}
      <div className="prose max-w-none mb-6 text-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content || "Pas de contenu pour cette leçon."}
        </ReactMarkdown>
      </div>

      {/* 📝 DESCRIPTION VIDÉO */}
      {lesson.videoDescription && (
        <div className="mb-3 text-gray-700 text-lg">{lesson.videoDescription}</div>
      )}

      {/* 🎥 VIDÉO */}
      {lesson.videoUrl && <LessonVideo videoUrl={lesson.videoUrl} />}

      {/* 📄 PDF */}
      {lesson.pdfUrl && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-yellow-900 text-xl">Ressources PDF</h2>
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 font-semibold underline"
          >
            Télécharger le PDF
          </a>
        </div>
      )}

      {/* 🧠 QUIZ */}
      {lesson.quizzes && lesson.quizzes.length > 0 ? (
        <div className="mt-6">
          <a
            href={`/dashboard/courses/${courseId}/modules/${lesson.moduleId}/lesson/${lesson.id}/quizzes/${lesson.quizzes[0].id}`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Commencer le quiz
          </a>
        </div>
      ) : (
        <div className="mt-6">
          <span className="inline-block bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
            Pas de quiz disponible
          </span>
        </div>
      )}

      {/* ✅ FIN : TERMINÉ + NAVIGATION */}
      <div className="flex justify-between items-center mt-10 border-t pt-6">
        <MarkLessonDone lessonId={lesson.id} courseId={Number(courseId)} />

        <div className="flex gap-4">
          {prevLesson && (
            <a
              href={`/dashboard/courses/${courseId}/modules/${lesson.moduleId}/lesson/${prevLesson.id}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Retour
            </a>
          )}

          {nextLesson && (
            <a
              href={`/dashboard/courses/${courseId}/modules/${lesson.moduleId}/lesson/${nextLesson.id}`}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Suivant
            </a>
          )}
        </div>
      </div>
    </div>
  );
}