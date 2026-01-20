"use server"; // 🔹 Ce fichier est strictement server-only

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// 🔹 Client Supabase server-only (dynamic import pour éviter Turbopack crash)
let supabaseServer: SupabaseClient<any, "public", "public"> | null = null;
async function getSupabaseServer() {
  if (!supabaseServer) {
    const mod = await import("@/lib/supabaseServer");
    supabaseServer = mod.supabaseServer;
  }
  return supabaseServer!;
}

// 🔹 Fonction pour sécuriser le nom du fichier
function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_.]/g, "_");
}

// 🔹 Export obligatoire POST asynchrone
export async function POST(req: Request) {
  try {
    // 1️⃣ Authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 2️⃣ Lire JSON envoyé depuis le frontend
    const body = await req.json();
    const fileBase64 = body.fileBase64 as string;
    const fileName = body.fileName as string;
    const fileType = body.fileType as string;
    const lessonId = Number(body.lessonId);
    const studentComment = body.comment?.toString() || "";

    if (!fileBase64 || !fileName || !fileType) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "lessonId invalide" }, { status: 400 });
    }

    // 3️⃣ Validation du fichier
    const allowedTypes = ["application/pdf", "application/zip"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo
    const buffer = Buffer.from(fileBase64, "base64");

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "Seuls PDF ou ZIP sont autorisés" },
        { status: 400 }
      );
    }

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );
    }

    // 4️⃣ Upload sur Supabase
    const safeFileName = sanitizeFileName(fileName);
    const filePath = `${user.id}/${lessonId}/${Date.now()}_${safeFileName}`;

    const supabase = await getSupabaseServer();

    const { error: uploadError } = await supabase.storage
      .from("assignment")
      .upload(filePath, buffer, { contentType: fileType, upsert: true });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data, error: urlError } = await supabase.storage
      .from("assignment")
      .createSignedUrl(filePath, 60 * 60); // URL valable 1h

    if (urlError || !data?.signedUrl) {
      return NextResponse.json({ error: "Impossible de générer l’URL" }, { status: 500 });
    }

    // 5️⃣ UPSERT AssignmentSubmission (ressoumission)
    const submission = await prisma.assignmentSubmission.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: {
        fileUrl: data.signedUrl,
        studentComment,
        status: SubmissionStatus.SUBMITTED,
      },
      create: {
        userId: user.id,
        lessonId,
        fileUrl: data.signedUrl,
        studentComment,
        status: SubmissionStatus.SUBMITTED,
      },
    });

    return NextResponse.json({
      success: true,
      submission,
      message: "✅ Devoir soumis avec succès",
    });
  } catch (err: any) {
    console.error("Erreur soumission assignment :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
