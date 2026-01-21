"use server"; // server-only

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// 🔹 Supabase server-only (lazy import – safe for Turbopack)
let supabaseServer: SupabaseClient | null = null;
async function getSupabaseServer() {
  if (!supabaseServer) {
    const mod = await import("@/lib/supabaseServer");
    supabaseServer = mod.supabaseServer;
  }
  return supabaseServer!;
}

// 🔹 Secure filename
function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_.]/g, "_");
}

// 🔹 POST /api/assignments/submit
export async function POST(req: Request) {
  try {
    /* =========================
       1️⃣ Auth
    ========================== */
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

    /* =========================
       2️⃣ Payload
    ========================== */
    const body = await req.json();

    const fileBase64 = body.fileBase64 as string;
    const fileName = body.fileName as string;
    const fileType = body.fileType as string;
    const lessonId = Number(body.lessonId);
    const studentComment = body.comment?.toString() || "";

    if (!fileBase64 || !fileName || !fileType || isNaN(lessonId)) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    /* =========================
       3️⃣ Validation fichier
    ========================== */
    const allowedTypes = ["application/pdf", "application/zip"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: "Seuls PDF ou ZIP sont autorisés" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(fileBase64, "base64");
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 Mo)" },
        { status: 400 }
      );
    }

    /* =========================
       4️⃣ Upload Supabase
    ========================== */
    const safeFileName = sanitizeFileName(fileName);
    const filePath = `assignment/${user.id}/${lessonId}/${Date.now()}_${safeFileName}`;

    const supabase = await getSupabaseServer();

    const { error: uploadError } = await supabase.storage
      .from("assignment")
      .upload(filePath, buffer, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Erreur upload fichier" },
        { status: 500 }
      );
    }

    /* =========================
       5️⃣ DB — stocker UNIQUEMENT le path
    ========================== */
    await prisma.assignmentSubmission.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        filePath, // ✅ PATH SEULEMENT
        studentComment,
        status: SubmissionStatus.SUBMITTED,
      },
      create: {
        userId: user.id,
        lessonId,
        filePath, // ✅ PATH SEULEMENT
        studentComment,
        status: SubmissionStatus.SUBMITTED,
      },
    });

    /* =========================
       6️⃣ Response
    ========================== */
    return NextResponse.json({
      success: true,
      message: "✅ Devoir soumis avec succès",
    });
  } catch (err) {
    console.error("Erreur soumission assignment:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

