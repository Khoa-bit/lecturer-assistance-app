// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type {
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections } from "raito";
import { _middlewarePBClient } from "./lib/pb_client";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pbClient, user } = _middlewarePBClient(
    `pb_auth=${request.cookies.get("pb_auth")?.value}`,
    url.pathname
  );

  if (!user && request.nextUrl.pathname === "/auth") {
    url.pathname = `/auth/login/`;
    console.log(`Being redirect to ${url}`);

    return NextResponse.redirect(url);
  } else if (user && request.nextUrl.pathname === "/fullDocuments/new") {
    const baseDocument = await pbClient
      .collection(Collections.Documents)
      .create<DocumentsResponse>({
        name: "Untitled",
        priority: "Medium",
        status: "Todo",
        owner: user.person,
      } as DocumentsRecord);

    const fullDocument = await pbClient
      .collection(Collections.FullDocuments)
      .create<FullDocumentsResponse>({
        document: baseDocument.id,
        category: "Draft",
      });

    url.pathname = `/fullDocuments/${fullDocument.id}`;
    console.log(`Being redirect to ${url}`);

    return NextResponse.redirect(url);
  }

  // console.log(`Middleware: Updated cookie (at ${request.nextUrl})`);

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
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).+)"],
};
