"use client";

import { useState } from "react";

interface SubmitAssignmentProps {
  userId: number;
  lessonId: number;
}

export default function SubmitAssignment({ userId, lessonId }: SubmitAssignmentProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file");

    const form = new FormData();
    form.append("userId", String(userId));
    form.append("lessonId", String(lessonId));
    form.append("file", file);

    const res = await fetch("/api/submissions", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Submit</button>
    </div>
  );
}
