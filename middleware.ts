import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protéger uniquement /dashboard/student
  if (!pathname.startsWith("/dashboard/student")) {
    return NextResponse.next();
  }

  // Vérifier JWT
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Vérifier rôle STUDENT
  if (token.role !== "STUDENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Edge-safe : pas de Prisma ici
  // Vérification des inscriptions au cours se fera dans les pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/student/:path*"],
};
