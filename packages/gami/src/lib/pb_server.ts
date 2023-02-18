import type { IncomingMessage } from "http";
import type { UsersResponse } from "raito";
import { env } from "src/env/server.mjs";
import type { PBServer } from "../global/pbServerGlobal";
import { pbServer } from "../global/pbServerGlobal";

export async function getPBServer(req: IncomingMessage): Promise<{
  pbServer: PBServer;
  user: UsersResponse | undefined;
}> {
  // Information Logging if a new client is initialized
  if (env.DEBUG_MODE === "true") {
    console.log(
      `debug - Initializing new PocketBase Server instance... ${req.headers}`
    );
  }

  // load the store data from the request cookie string
  pbServer.authStore.loadFromCookie(req?.headers?.cookie || "");

  // // Default token expires in 14 days
  // // Approximate 24 clicks/day * 14 days = 336 (clicks/14 days)
  // if (pbServer.authStore.isValid && getRandomInt(336) == 0) {
  //   // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
  //   // clear the auth store on failed refresh
  //   await pbServer
  //     .collection(Collections.Users)
  //     .authRefresh<UsersResponse>()
  //     .catch(() => pbServer.authStore.clear());
  // }

  const user = pbServer.authStore.model as unknown as UsersResponse | undefined;

  // // send back the default 'pb_auth' cookie to the client with the latest store state
  // res?.setHeader("set-cookie", pbServer.authStore.exportToCookie());

  return { pbServer, user };
}
