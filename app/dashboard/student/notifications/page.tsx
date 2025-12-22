"use client";
import { useState } from "react";


interface Props {
  submissionId: number;
  studentName: string;
  lessonName: string;
}

export default function GradeAssignment({ submissionId, studentName, lessonName }: Props) {
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleGrade = async () => {
    try {
      const res = await fetch("/api/admin/gradeSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, score, feedback }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setMessage(`Devoir gradé avec succès. Notification envoyée à ${studentName}.`);
    } catch (err: any) {
      setMessage(`Erreur : ${err.message}`);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
      <h3>
        Grade Submission - {studentName} ({lessonName})
      </h3>
      <div>
        <label>Score: </label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Feedback: </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <button onClick={handleGrade} style={{ marginTop: "10px" }}>
        Enregistrer et Notifier
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
