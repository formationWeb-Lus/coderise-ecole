// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware Next.js pour sécuriser le dashboard
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // On protège uniquement les routes /dashboard/*
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Récupération du token JWT
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Si pas de token => redirection vers signin
  if (!token?.sub) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Vérification des rôles pour les routes spécifiques
  if (pathname.startsWith("/dashboard/student") && token.role !== "STUDENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard/teacher") && token.role !== "TEACHER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Appliquer le middleware aux dashboards
export const config = {
  matcher: ["/dashboard/:path*"],
};
