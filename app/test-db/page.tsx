import { prisma } from "@/lib/prisma";

export default async function TestDBPage() {
  try {
    const courses = await prisma.course.findMany();
    console.log("Courses:", courses);
    return <div>Check server console for courses</div>;
  } catch (err) {
    console.error("DB ERROR:", err);
    return <div>Database connection failed</div>;
  }
}
