import LessonsPageClient from "./LessonsPageClient";

interface PageProps {
  params: Promise<{ courseId: string; moduleId: string }>;
}

export default function LessonsPage({ params }: PageProps) {
  // On passe les params dynamiques au composant client
  return <LessonsPageClient params={params} />;
}

