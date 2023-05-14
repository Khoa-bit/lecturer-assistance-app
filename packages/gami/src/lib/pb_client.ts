import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import type { UsersResponse } from "raito";
import { useMemo } from "react";
import { env } from "src/env/client.mjs";
import type { PBCustom } from "src/types/pb-custom";
import { apiGetList } from "./pb_crud";

export function usePBClient(pbAuthCookie: string): {
  pbClient: PBCustom;
  user: UsersResponse;
} {
  const router = useRouter();

  const pbClient = useMemo(() => {
    // Information Logging if a new client is initialized
    if (env.NEXT_PUBLIC_DEBUG_MODE === "true") {
      console.log(
        `debug - Initializing new PocketBase Client instance... ${router.asPath}`
      );
    }

    const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL) as PBCustom;

    // load the store data from the request cookie string
    pb.authStore.loadFromCookie(
      pbAuthCookie.replace("%2C%22record%22%3A%7B", "%2C%22model%22%3A%7B")
    );

    return pb;
  }, [pbAuthCookie, router.asPath]);

  // Must have been authenticated by middleware by now
  const user = pbClient.authStore.model as unknown as UsersResponse | undefined;

  if (!user) {
    throw new Error("500 - Unauthenticated user must have been redirect");
  }

  // Inject functions to PBClient object
  pbClient.apiGetList = apiGetList;

  return { pbClient, user };
}

export function _getPBMiddleware(
  pbAuthCookie: string,
  pathname: string
): {
  pbClient: PBCustom;
  user: UsersResponse | undefined;
} {
  // Information Logging if a new client is initialized
  if (env.NEXT_PUBLIC_DEBUG_MODE === "true") {
    console.log(
      `debug - Initializing new PocketBase Middleware instance... ${pathname} (middleware)`
    );
  }

  const pbClient = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL) as PBCustom;

  // load the store data from the request cookie string
  pbClient.authStore.loadFromCookie(
    pbAuthCookie.replace("%2C%22record%22%3A%7B", "%2C%22model%22%3A%7B")
  );

  const user = pbClient.authStore.model as unknown as UsersResponse | undefined;

  // Inject functions to PBClient object
  pbClient.apiGetList = apiGetList;

  return { pbClient, user };
}
