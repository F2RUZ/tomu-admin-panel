// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

// Admin panelga kirishi mumkin bo'lgan rollar
const ALLOWED_ROLES = ["admin", "director", "teacher"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // ── Login sahifasiga token bilan kirsa — dashboard ga yo'naltir ──
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── Protected sahifaga token yo'q — login ga yo'naltir ──
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    // Qaytish uchun redirect param saqlash
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Token bor — role tekshiruv ──
  if (token) {
    try {
      // JWT payload ni decode qilish (verify emas — edge runtime da jose kerak)
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      // Token muddati tugagan bo'lsa
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("accessToken");
        return response;
      }

      // Role tekshiruv — agar role JWT da bo'lsa
      if (payload.role) {
        const role = payload.role?.toLowerCase();
        if (!ALLOWED_ROLES.includes(role)) {
          const response = NextResponse.redirect(
            new URL("/login", request.url),
          );
          response.cookies.delete("accessToken");
          return response;
        }
      }
    } catch {
      // Token parse xatosi — login ga
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|public).*)"],
};
