// page.tsx
import ModulesPageClient from "./ModulesPageClient";

interface PageProps {
  params: { courseId: string } | Promise<{ courseId: string }>;
}

export default async function ModulesPage({ params }: PageProps) {
  const resolvedParams = await params; // unwrap Promise
  return <ModulesPageClient courseId={resolvedParams.courseId} />;
}

