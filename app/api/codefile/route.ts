import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 💾 CREATE / UPDATE FILE
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await req.json();

    // 🟢 UPDATE FILE
    if (body.id) {
      const existing = await prisma.codeFile.findFirst({
        where: {
          id: body.id,
          userId,
        },
      });

      if (!existing) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const file = await prisma.codeFile.update({
        where: { id: body.id },
        data: {
          name: body.name,
          html: body.html,
          css: body.css,
          js: body.js,
        },
      });

      return Response.json(file);
    }

    // 🟢 CREATE FILE
    const file = await prisma.codeFile.create({
      data: {
        name: body.name,
        html: body.html,
        css: body.css,
        js: body.js,
        userId,
        folderId: body.folderId,
      },
    });

    return Response.json(file);
  } catch (error) {
    console.error("CODEFILE POST ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// ❌ DELETE FILE
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { id } = await req.json();

    const file = await prisma.codeFile.findFirst({
      where: { id, userId },
    });

    if (!file) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.codeFile.delete({
      where: { id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("DELETE FILE ERROR:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}