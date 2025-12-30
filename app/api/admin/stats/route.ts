import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const studentCount = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const teacherCount = await prisma.user.count({
    where: { role: "TEACHER" },
  });

  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  const courseCount = await prisma.course.count();

  return NextResponse.json({
    students: studentCount,
    teachers: teacherCount,
    admin: adminCount,
    courses: courseCount,
  });
}

