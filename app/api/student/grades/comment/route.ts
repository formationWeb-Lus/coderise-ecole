import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { submissionId, comment } = await req.json();

  await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { studentComment: comment },
  });

  return NextResponse.json({ message: "Commentaire ajouté." });
}
