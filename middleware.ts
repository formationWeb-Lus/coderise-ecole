import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleAccessMap: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["TEACHER"],
  "/dashboard/student": ["STUDENT"],

  // 🔒 API protégées
  "/api/admin": ["ADMIN"],
  "/api/teacher": ["TEACHER"],
  "/api/student": ["STUDENT"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

 const publicPaths = [
  "/auth/signin",
  "/auth/unauthorized",
  "/api/auth",
  "/login",
  "/register",

  // ✅ AJOUT IMPORTANT
  "/api/register",
  "/api/login",
];

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔐 Routes à protéger
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api")
  ) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 🚨 Non connecté
    if (!token) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "UNAUTHORIZED" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(
        new URL("/auth/signin", req.url)
      );
    }

    // 🔐 Vérification des rôles
    for (const path in roleAccessMap) {
      if (pathname.startsWith(path)) {
        const allowedRoles = roleAccessMap[path];
        if (!allowedRoles.includes(token.role as string)) {
          return NextResponse.redirect(
            new URL("/auth/unauthorized", req.url)
          );
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
