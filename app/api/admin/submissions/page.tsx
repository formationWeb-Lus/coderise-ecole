import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.assignmentSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      lesson: true,
    },
  });

  return (
    <div>
      <h1 className="text-xl font-bold">All Submissions</h1>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Lesson</th>
            <th>File</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td>{s.user.name}</td>
              <td>{s.lesson.title}</td>
              <td>
                <a
                  href={s.fileUrl}
                  target="_blank"
                  className="text-blue-500 underline"
                >
                  View File
                </a>
              </td>
              <td>{s.status}</td>
              <td>{s.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
