export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// sécuriser le nom du fichier
function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_.]/g, "_");
}

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const { lessonId, fileName, fileType } = await req.json();

  if (!lessonId || !fileName || !fileType) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const safeName = sanitizeFileName(fileName);
  const path = `${user.id}/${lessonId}/${Date.now()}_${safeName}`;

  const { data, error } = await supabase.storage
    .from("assignment")
    .createSignedUploadUrl(path);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    uploadUrl: data.signedUrl,
    path,
  });
}
