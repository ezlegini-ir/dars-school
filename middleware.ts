import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authApi,
  privateRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./data/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();
  //! const role: userRole | undefined = session?.user.role;       "LEARN ROLE BASED"
  const isLoggedIn = !!session?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(authApi);
  const isPrivateRoute = privateRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && isPrivateRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
