import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { locales } from "@/lib/i18n";
import { updateSession } from "@/utils/supabase/middleware";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseResponse = await updateSession(request);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return supabaseResponse;
  }

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!locale || !locales.includes(locale as "id" | "en")) {
    const url = request.nextUrl.clone();
    url.pathname = `/id${pathname}`;
    return NextResponse.redirect(url);
  }

  const protectedAdminPath = segments[1] === "admin" || pathname.startsWith("/admin");

  if (protectedAdminPath) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
