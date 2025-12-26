import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files: any) => {
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));

      const file = files.file;
      if (!file) return resolve(NextResponse.json({ error: "Fichier manquant" }, { status: 400 }));

      const imagePath = `/uploads/${path.basename(file.filepath)}`;

      // Mettre à jour Prisma
      await prisma.user.update({
        where: { email: fields.email as string },
        data: { image: imagePath },
      });

      resolve(NextResponse.json({ image: imagePath }));
    });
  });
}
