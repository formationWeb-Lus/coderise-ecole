"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseCard({ course }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;

    console.log("CLICK DETECTED ✅");

    setLoading(true);

    setTimeout(() => {
      router.push(`/enrollment/${course.id}/pricing`);
    }, 700);
  };

  return (
    <>
      <div onClick={handleClick} className={`card ${loading ? "loading" : ""}`}>
        
        <h2 className="title">
          {loading ? "Loading..." : course.title}
        </h2>

        <p className="desc">
          {course.description}
        </p>

        <div className="action">
          {loading ? (
            <span className="loading-text">Chargement...</span>
          ) : (
            "Voir la tarification →"
          )}
        </div>

      </div>

      {/* ===== CSS ===== */}
      <style jsx>{`
        .card {
          cursor: pointer;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          background: white;
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .card:hover {
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          transform: translateY(-5px);
        }

        .title {
          font-size: 20px;
          font-weight: bold;
          transition: color 0.3s ease;
        }

        .desc {
          color: #6b7280;
          margin-top: 8px;
          font-size: 14px;
        }

        .action {
          margin-top: 16px;
          color: #2563eb;
          font-weight: 600;
        }

        /* ===== ANIMATION CLICK ===== */
        .loading {
          background: #fef9c3;
          transform: scale(0.96);
          opacity: 0.85;
        }

        .loading .title {
          color: #b45309;
          animation: pulse 1s infinite;
        }

        .loading-text {
          color: #b45309;
          font-weight: bold;
        }

        /* animation pulse */
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}