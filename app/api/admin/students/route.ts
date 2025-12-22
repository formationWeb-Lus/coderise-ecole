// app/api/admin/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Typage explicite
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" }, // Prisma enum Role
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(students);
}
