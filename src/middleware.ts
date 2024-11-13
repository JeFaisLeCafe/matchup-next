import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  const isAuthPage = ["/", "/login", "/register"].includes(
    request.nextUrl.pathname
  );

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/quizzes", request.url));
    }
  } else {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/quizzes", "/create", "/profile"]
};
