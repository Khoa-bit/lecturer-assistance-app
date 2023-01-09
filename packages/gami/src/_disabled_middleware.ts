// middleware.ts
import type { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  console.log("=====Middleware starts=====");

  // const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

  // const isLoginSuccess = await pb
  //   .collection(Collections.Users)
  //   .authWithPassword<UsersResponse>(
  //     "nguyenanhkhoablue@proton.me",
  //     "hAarmRmAKXmCPnYfGJpu@2ANvNV3iaxWUCcs%hXAbLjy$B6q4&PEwjV7sT!bv$Z!"
  //   )
  //   .then(() => {
  //     return true;
  //   })
  //   .catch(() => {
  //     return false;
  //   });

  // console.log(`IsLoginSuccess ${isLoginSuccess}`);

  // load the store data from the request cookie string
  console.log(request.cookies.get("pb_auth")?.value);

  // pb.authStore.loadFromCookie(request.cookies.get("pb_auth")?.value || "");

  // // send back the default 'pb_auth' cookie to the client with the latest store state
  // pb.authStore.onChange(() => {
  //   response.cookies.set("pb_auth", pb.authStore.exportToCookie());
  // });

  // try {
  //   // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
  //   pb.authStore.isValid && (await pb.collection("users").authRefresh());
  // } catch (_) {
  //   // clear the auth store on failed refresh
  //   pb.authStore.clear();
  // }

  // console.log("=====Middleware ends=====");
  // return NextResponse.redirect(new URL("/about-2", request.url));
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/about/:path*",
// };
