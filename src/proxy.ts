import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isStudentRoute = nextUrl.pathname.startsWith("/student");
  const isParentRoute = nextUrl.pathname.startsWith("/parent");
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isLoginRoute) {
    if (isLoggedIn) {
      const role = (req.auth?.user as any)?.role;
      return NextResponse.redirect(new URL(role === "PARENT" ? "/parent" : "/student", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && (isStudentRoute || isParentRoute)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn) {
    const role = (req.auth?.user as any)?.role;
    if (isStudentRoute && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/parent", nextUrl));
    }
    if (isParentRoute && role !== "PARENT") {
      return NextResponse.redirect(new URL("/student", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/student/:path*", "/parent/:path*", "/login"],
};
