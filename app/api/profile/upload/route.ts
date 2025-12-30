import formidable from "formidable";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Configuration pour la route (Edge/Node)
export const runtime = "nodejs";       // utiliser Node.js runtime
export const dynamic = "force-dynamic"; // empêcher le pré-rendu statique

// Désactiver le parsing automatique de Next.js
export const revalidate = 0; // ne jamais réutiliser le cache

export async function POST(req: Request) {
  // Créer un dossier temporaire pour stocker les fichiers uploadés
  const uploadDir = path.join(process.cwd(), "/public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  try {
    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
