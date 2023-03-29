// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { _middlewarePBClient } from "./lib/pb_client";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { user } = _middlewarePBClient(
    `pb_auth=${request.cookies.get("pb_auth")?.value}`,
    url.pathname
  );

  console.log("hello", request.nextUrl.pathname);

  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    url.pathname = `/auth/login/`;
    console.log(`Being redirect to ${url}`);

    return NextResponse.redirect(url);
  } else if (request.nextUrl.pathname.length <= 1) {
    url.pathname = `/eventDocuments`;
    console.log(`Being redirect to ${url}`);

    return NextResponse.redirect(url);
  }

  // if (env.NEXT_PUBLIC_DEBUG_MODE === "true") {
  //   console.log(`Middleware: Updated cookie (at ${request.nextUrl})`);
  // }

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next();

  // // Set a new response header `x-hello-from-middleware2`
  // response.headers.set("set-cookie", pbClient.authStore.exportToCookie());

  return response;
}

// See "Matching Paths" below to learn more
/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).+)", "/"],
};
