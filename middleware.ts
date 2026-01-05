// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleAccessMap: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["TEACHER"],
  "/dashboard/student": ["STUDENT"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔒 Pas connecté
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // 🔐 Vérification par rôle
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
