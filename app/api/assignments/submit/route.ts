// ─────────────────────────────
// Upload Assignment – route.ts
// ─────────────────────────────

// ⚡ Forcer Node.js runtime (Vercel Edge ne supporte pas Buffer)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth"; // ✅ stable
import { authOptions } from "@/lib/auth";        // ✅ remplace auth
import { prisma } from "@/lib/prisma";

// 🔹 Fonction pour sécuriser le nom de fichier
function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_.]/g, "_");
}

export async function POST(req: Request) {
  // 🔹 Initialiser Supabase avec Service Role (backend only)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // ==========================
    // 1️⃣ Authentification stable
    // ==========================
    const session = await getServerSession(authOptions); // ✅
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 400 }
      );
    }

    // ==========================
    // 2️⃣ Lire FormData
    // ==========================
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lessonId = Number(formData.get("lessonId"));
    const comment = formData.get("comment")?.toString() || null;

    if (!file)
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    if (isNaN(lessonId))
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });

    // ==========================
    // 3️⃣ Validation fichier
    // ==========================
    const allowedTypes = ["application/pdf", "application/zip"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

    if (!allowedTypes.includes(file.type))
      return NextResponse.json(
        { error: "Seuls PDF ou ZIP autorisés" },
        { status: 400 }
      );

    if (file.size > MAX_SIZE)
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );

    // ==========================
    // 4️⃣ Upload Supabase
    // ==========================
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFileName = sanitizeFileName(file.name);
    const filePath = `${user.id}/${lessonId}/${Date.now()}_${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("assignment")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // ==========================
    // 5️⃣ Générer URL signée
    // ==========================
    const { data, error: urlError } = await supabase.storage
      .from("assignment")
      .createSignedUrl(filePath, 60 * 60); // 1h

    if (urlError || !data?.signedUrl) {
      return NextResponse.json(
        { error: "Impossible de générer l’URL" },
        { status: 500 }
      );
    }

    // ==========================
    // 6️⃣ Enregistrer dans la DB
    // ==========================
    const submission = await prisma.assignmentSubmission.create({
      data: {
        userId: user.id,
        lessonId,
        fileUrl: data.signedUrl,
        studentComment: comment,
      },
    });

    // ==========================
    // 7️⃣ Retour JSON clair
    // ==========================
    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    console.error("Erreur soumission :", err);

    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Vous avez déjà soumis ce devoir" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
