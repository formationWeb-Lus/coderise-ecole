import { prisma } from "@/lib/prisma";
import AnnouncementForm from "./AnnouncementForm";

export default async function CreateAnnouncementPage() {
  // Récupération des cours depuis Prisma
  const courses = await prisma.course.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return <AnnouncementForm courses={courses} />;
}

