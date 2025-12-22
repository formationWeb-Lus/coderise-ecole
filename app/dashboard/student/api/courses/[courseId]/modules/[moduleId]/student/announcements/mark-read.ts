import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ error: "Unauthorized" });

  const userId = Number(session.user.id);
  const { announcementIds } = req.body as { announcementIds: number[] };

  const createData = announcementIds.map((id) => ({
    userId,
    announcementId: id,
  }));

  // Créer les entrées uniquement si elles n'existent pas encore
  await prisma.announcementRead.createMany({
    data: createData,
    skipDuplicates: true,
  });

  res.status(200).json({ ok: true });
}
