import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 🔐 Supabase client (BACKEND ONLY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // ==========================
    // 1️⃣ AUTHENTIFICATION
    // ==========================
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
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
    // 2️⃣ LECTURE FORM DATA
    // ==========================
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const lessonId = Number(formData.get("lessonId"));
    const comment =
      formData.get("comment")?.toString() || null;

    if (!file) {
      return NextResponse.json(
        { error: "Fichier manquant" },
        { status: 400 }
      );
    }

    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: "lessonId invalide" },
        { status: 400 }
      );
    }

    // ==========================
    // 3️⃣ VALIDATION FICHIER
    // ==========================
    const allowedTypes = [
      "application/pdf",
      "application/zip",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Seuls les fichiers PDF ou ZIP sont autorisés" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );
    }

    // ==========================
    // 4️⃣ UPLOAD SUPABASE
    // ==========================
    const buffer = Buffer.from(await file.arrayBuffer());

    // Organisation propre des fichiers
    const filePath = `${user.id}/${lessonId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("assignment")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Erreur upload Supabase" },
        { status: 500 }
      );
    }

    // ==========================
    // 5️⃣ URL PUBLIQUE
    // ==========================
    const { data } = supabase.storage
      .from("assignment")
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: "Impossible de générer l’URL du fichier" },
        { status: 500 }
      );
    }

    // ==========================
    // 6️⃣ ENREGISTREMENT DB
    // ==========================
    const submission =
      await prisma.assignmentSubmission.create({
        data: {
          userId: user.id,
          lessonId,
          fileUrl: data.publicUrl,
          studentComment: comment,
        },
      });

    // ==========================
    // 7️⃣ RÉPONSE OK
    // ==========================
    return NextResponse.json({
      success: true,
      submission,
    });
  } catch (err: any) {
    console.error("Erreur soumission :", err);

    // Devoir déjà soumis
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Vous avez déjà soumis ce devoir" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
