import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleAccessMap: Record<string, string[]> = {
  "/dashboard/admin": ["ADMIN"],
  "/dashboard/teacher": ["TEACHER"],
  "/dashboard/student": ["STUDENT"],

  "/api/admin": ["ADMIN"],
  "/api/teacher": ["TEACHER"],
  "/api/student": ["STUDENT"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/auth/signin",
    "/auth/unauthorized",
    "/login",
    "/register",
    "/api/register",
    "/api/login",
  ];

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 🔴 non connecté
  if (!token) {
    return pathname.startsWith("/api")
      ? NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
      : NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // 🔐 protection par rôle
  const matchedRoute = Object.keys(roleAccessMap).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = roleAccessMap[matchedRoute];

    if (!allowedRoles.includes(token.role as string)) {
      return NextResponse.redirect(
        new URL("/auth/unauthorized", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};