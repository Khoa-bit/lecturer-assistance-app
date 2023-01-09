import PocketBase from "pocketbase";
import type { UsersResponse } from "raito";
import { Collections } from "raito";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import type { PBClearResponse } from "src/pages/api/auth/pbClear";

interface AuthWithPasswordAndCookieArgs {
  username: string;
  password: string;
  pbClient: PocketBase;
}

interface ClearAuthStoreAndCookieArgs {
  pbClient: PocketBase;
}

export async function authWithPasswordAndCookie({
  username,
  password,
  pbClient,
}: AuthWithPasswordAndCookieArgs) {
  return await pbClient
    .collection(Collections.Users)
    .authWithPassword<UsersResponse>(username, password)
    .then((record) => {
      document.cookie = pbClient.authStore.exportToCookie({
        httpOnly: false,
      });
      return record.record;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function clearAuthStoreAndCookie({
  pbClient,
}: ClearAuthStoreAndCookieArgs) {
  return await fetch("/api/auth/pbClear/", { method: "PUT" })
    .then((res) => {
      pbClient.authStore.clear();
      return res.json() as Promise<PBClearResponse>;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export function useAuthContext() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined. Missing AuthContextProvider for the current scope."
    );
  }
  return authContext;
}
