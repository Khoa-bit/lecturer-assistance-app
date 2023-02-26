import { useRouter } from "next/router";
import PocketBase from "pocketbase";
import type { UsersResponse } from "raito";
import { env } from "src/env/client.mjs";

export function usePBClient(pbAuthCookie: string): {
  pbClient: PocketBase;
  user: UsersResponse | undefined;
} {
  const router = useRouter();

  // Information Logging if a new client is initialized
  if (env.NEXT_PUBLIC_DEBUG_MODE === "true") {
    console.log(
      `debug - Initializing new PocketBase Client instance... ${router.asPath}`
    );
  }

  const pbClient = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

  // load the store data from the request cookie string
  pbClient.authStore.loadFromCookie(pbAuthCookie);

  const user = pbClient.authStore.model as unknown as UsersResponse | undefined;

  return { pbClient, user };
}

export function _middlewarePBClient(
  pbAuthCookie: string,
  pathname: string
): {
  pbClient: PocketBase;
  user: UsersResponse | undefined;
} {
  // Information Logging if a new client is initialized
  if (env.NEXT_PUBLIC_DEBUG_MODE === "true") {
    console.log(
      `debug - Initializing new PocketBase Client instance... ${pathname} (middleware)`
    );
  }

  const pbClient = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

  // load the store data from the request cookie string
  pbClient.authStore.loadFromCookie(pbAuthCookie);

  const user = pbClient.authStore.model as unknown as UsersResponse | undefined;

  return { pbClient, user };
}
