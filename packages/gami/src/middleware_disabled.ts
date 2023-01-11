// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env/client.mjs";
import PocketBase from "pocketbase";

const pbClient = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("=====Middleware starts=====");

  // load the store data from the request cookie string
  console.log(
    `request.cookies.get("pb_auth")?.value: ${
      request.cookies.get("pb_auth")?.value
    }`
  );

  pbClient.authStore.loadFromCookie(
    request.cookies.get("pb_auth")?.value || ""
  );

  console.log(`pbClient.authStore.isValid: ${pbClient.authStore.isValid}`);

  try {
    // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
    pbClient.authStore.isValid &&
      (await pbClient.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pbClient.authStore.clear();
  }

  console.log(JSON.stringify(pbClient.authStore.exportToCookie()));

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next({});

  // Set a new response header `x-hello-from-middleware2`
  // response.headers.set("set-cookie", pbClient.authStore.exportToCookie());
  return response;
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };
