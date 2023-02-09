import PocketBase from "pocketbase";

import { env } from "src/env/server.mjs";
import type { APIGetList } from "src/lib/pb_crud";
import { apiGetList } from "src/lib/pb_crud";

export interface PBServer extends PocketBase {
  apiGetList: APIGetList;
}

declare global {
  // eslint-disable-next-line no-var
  var pbServer: PBServer | undefined;
}

// Information Logging if a new client is initialized
if (env.DEBUG_MODE === "true" && !globalThis.pbServer) {
  console.log("debug - Initializing new PocketBase instance...");
}

// Assign pbServer as :
// - New PocketBase clients in Production
// - Reuse PocketBase clients in Development or Test
export const pbServer =
  globalThis.pbServer ?? (new PocketBase(env.POCKETBASE_URL) as PBServer);

// Inject functions to PBServer object
pbServer.apiGetList = apiGetList;

// Set pbServer as Global Object
if (env.NODE_ENV !== "production") {
  globalThis.pbServer = pbServer;
}
