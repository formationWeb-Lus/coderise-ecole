"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Lesson {
  id: number;
  title: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CoursePageClientProps {
  courseId: number;
  modules: Module[];
}

export default function CoursePageClient({
  courseId,
  modules,
}: CoursePageClientProps) {
  const router = useRouter();

  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  const [loadingLessonId, setLoadingLessonId] = useState<number | null>(null);

  const handleLessonClick = (lessonId: number, moduleIndex: number) => {
    if (loadingLessonId) return;

    setLoadingLessonId(lessonId);

    setTimeout(() => {
      router.push(
        `/dashboard/courses/${courseId}/modules/week-${moduleIndex}/lesson/${lessonId}`
      );
    }, 600);
  };

  if (!modules || modules.length === 0) {
    return (
      <p className="text-yellow-900 text-lg">
        Aucun module disponible pour ce cours.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {modules.map((module, idx) => {
          const isOpen = openModuleId === module.id;

          return (
            <div
              key={module.id}
              className="module-card"
            >

              {/* MODULE HEADER */}
              <button
                onClick={() =>
                  setOpenModuleId(isOpen ? null : module.id)
                }
                className="module-header"
              >
                <h2 className="module-title">
                  S {idx + 1} — {module.title}
                </h2>

                <span className="module-icon">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

             {isOpen && (
  <ul className="lesson-list">
    {module.lessons.map((lesson) => {
      const isLoading = loadingLessonId === lesson.id;

      return (
        <li key={lesson.id}>
          <button
            onClick={() => handleLessonClick(lesson.id, idx + 1)}
          
                          className={`lesson-item ${
                            isLoading ? "loading" : ""
                          }`}
                        >
                          {isLoading ? "Loading..." : lesson.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

            </div>
          );
        })}
      </div>

      {/* ===== CSS ===== */}
      <style jsx>{`
        .module-card {
          border: 1px solid #facc15;
          background: #fefce8;
          border-radius: 16px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .module-header {
          width: 100%;
          padding: 16px 24px;
          background: #fde68a;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 16px 16px 0 0;
          cursor: pointer;
          transition: 0.2s;
        }

        .module-header:hover {
          background: #fcd34d;
        }

        .module-title {
          font-size: 22px;
          font-weight: 700;
          color: #78350f;
        }

        .module-icon {
          font-size: 26px;
          font-weight: bold;
          color: #78350f;
        }

        .lesson-list {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .lesson-item {
          font-size: 18px;
          font-weight: 600;
          color: #15803d;
          text-decoration: underline;
          text-underline-offset: 4px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-align: left;
        }

        .lesson-item:hover {
          color: #14532d;
          transform: translateX(4px);
        }

        /* 🔥 ANIMATION CLICK */
        .lesson-item.loading {
          color: #b45309;
          animation: pulse 1s infinite;
          transform: scale(0.97);
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}