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

  const lessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });

  const index = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[index - 1];
  const nextLesson = lessons[index + 1];

  // Premier exercice pour le quiz
  const firstExercise = lesson.exercises[0];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

      {/* Contenu Markdown */}
      <div className="prose max-w-none mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {lesson.content || "Pas de contenu pour cette leçon."}
        </ReactMarkdown>
      </div>

      {/* Vidéo */}
      {lesson.videoUrl && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Vidéo de la leçon</h2>
          <video controls src={lesson.videoUrl} className="w-full rounded" />
        </div>
      )}

      {/* PDF */}
      {lesson.pdfUrl && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Ressources PDF</h2>
          <a
            href={lesson.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Télécharger le PDF
          </a>
        </div>
      )}

      {/* Bouton Soumettre le devoir */}
      <div className="mt-6">
        <a
          href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${lesson.id}/assignment`}
          className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Soumettre le devoir
        </a>
      </div>

      <MarkLessonDone lessonId={lesson.id} courseId={Number(courseId)} />

      {/* Bouton Commencer le quiz */}
      {firstExercise && (
        <div className="mt-6">
          <a
            href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${lesson.id}/exercise/${firstExercise.id}`}
            className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Commencer le quiz
          </a>
        </div>
      )}

      {/* Navigation leçon précédente / suivante */}
      <div className="flex justify-between mt-10 border-t pt-6">
        {prevLesson ? (
          <a
            href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${prevLesson.id}`}
            className="text-blue-600 hover:underline"
          >
            ← {prevLesson.title}
          </a>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <a
            href={`/dashboard/courses/${courseId}/modules/${week}/lesson/${nextLesson.id}`}
            className="text-blue-600 hover:underline"
          >
            {nextLesson.title} →
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
