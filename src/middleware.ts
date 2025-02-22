// import { NextResponse } from "next/server"
// import { getToken } from "next-auth/jwt"
// import type { NextRequest } from "next/server"

// export async function middleware(request: NextRequest) {
//   const token = (await getToken({ req: request })) as { username: string } | null

//   if (!token && request.nextUrl.pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/login", request.url))
//   }

//   if (token && request.nextUrl.pathname === "/login") {
//     return NextResponse.redirect(new URL("/admin", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/admin/:path*", "/login"],
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";


// Укажем конфигурацию для Edge Runtime
export const config = {
  matcher: ["/admin/:path*", "/login"],
};

export async function middleware(request: NextRequest) {
  try {
    // Получаем токен с secret из .env
    const session = await auth();

    // Защита админ роутов
    if (!session && request.nextUrl.pathname.startsWith("/admin")) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    // Редирект с логина если авторизован
    if (session && request.nextUrl.pathname === "/login") {
      const url = new URL("/admin", request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // В случае ошибки редиректим на страницу логина
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}
