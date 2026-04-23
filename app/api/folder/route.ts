import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 📥 GET FOLDERS + FILES
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json([]); // 🔥 toujours array
    }

    const userId = Number(session.user.id);

    const folders = await prisma.codeFolder.findMany({
      where: { userId },
      include: {
        files: true, // 🔥 important pour ton explorer
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(folders);
  } catch (error) {
    console.error("GET FOLDER ERROR:", error);
    return Response.json([]); // 🔥 jamais crash frontend
  }
}

// ➕ CREATE FOLDER
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await req.json();

    const folder = await prisma.codeFolder.create({
      data: {
        name: body.name,
        userId,
      },
      include: {
        files: true,
      },
    });

    return Response.json(folder);
  } catch (error) {
    console.error("CREATE FOLDER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ❌ DELETE FOLDER (OPTIONNEL MAIS IMPORTANT)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { id } = await req.json();

    const folder = await prisma.codeFolder.findFirst({
      where: { id, userId },
    });

    if (!folder) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.codeFolder.delete({
      where: { id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE FOLDER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ✏️ RENAME FOLDER
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { id, name } = await req.json();

    const folder = await prisma.codeFolder.findFirst({
      where: { id, userId },
    });

    if (!folder) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.codeFolder.update({
      where: { id },
      data: { name },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH FOLDER ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}