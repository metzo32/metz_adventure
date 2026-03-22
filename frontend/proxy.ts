import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PATHS = ["/auth/login", "/auth/register"];
const PUBLIC_PATHS = ["/"];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (isPublicPath) return NextResponse.next();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/places", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts).*)"],
};
