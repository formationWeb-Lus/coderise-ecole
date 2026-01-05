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

// Composant réutilisable pour afficher la vidéo
function LessonVideo({ videoUrl }: { videoUrl: string }) {
  // Détection YouTube
  const isYouTube = videoUrl.includes("youtu");

  if (isYouTube) {
    // Récupère l'ID vidéo (youtu.be ou youtube.com)
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

  // Si ce n'est pas YouTube, on suppose un fichier vidéo direct (MP4, WebM, etc.)
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
    include: { exercises: true },
  });

  if (!lesson) {
    return <div className="p-4 text-red-600">Leçon non trouvée</div>;
  }

  // Toutes les leçons du module (navigation)
  const lessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  const firstExercise = lesson.exercises[0];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* 🔝 TITRE + BOUTON DEVOIR (SEULEMENT LEÇON 5) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-900">{lesson.title}</h1>

        {lesson.order === 5 && (
          <a
            href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${lesson.id}/assignment`}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Soumettre le devoir
          </a>
        )}
      </div>

      {/* 📝 CONTENU MARKDOWN */}
      <div className="prose max-w-none mb-6 text-lg">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content || "Pas de contenu pour cette leçon."}
        </ReactMarkdown>
      </div>

      {/* 📝 DESCRIPTION DE LA VIDÉO */}
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
      {firstExercise && (
        <div className="mt-6">
          <a
            href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${lesson.id}/exercise/${firstExercise.id}`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Commencer le quiz
          </a>
        </div>
      )}

      {/* ✅ BAS DE PAGE : TERMINÉ + NAVIGATION */}
      <div className="flex justify-between items-center mt-10 border-t pt-6">
        {/* TOUJOURS VISIBLE */}
        <MarkLessonDone lessonId={lesson.id} courseId={Number(courseId)} />

        <div className="flex gap-4">
          {prevLesson && (
            <a
              href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${prevLesson.id}`}
              className="text-green-700 font-semibold underline"
            >
              ← {prevLesson.title}
            </a>
          )}

          {nextLesson && (
            <a
              href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${nextLesson.id}`}
              className="text-green-700 font-semibold underline"
            >
              {nextLesson.title} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
