import { useRouter } from "next/router";
import type { Admin, Record } from "pocketbase";
import PocketBase from "pocketbase";
import type { UsersResponse } from "raito";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { env } from "src/env/client.mjs";
import {
  authWithPasswordAndCookie,
  clearAuthStoreAndCookie,
} from "src/lib/auth_client";
import type { PBClearResponse } from "src/pages/api/auth/pbClear";
import { AuthContext } from "./AuthContext";

// Casting to convert (Record | Admin | null) from authStore.model to UsersResponse
export type User = UsersResponse & (Record | Admin | null);

export type AuthContextType = {
  isValid: boolean;
  user: UsersResponse | null;
  pbClient: PocketBase;
  signInWithPassword: (
    username: string,
    password: string
  ) => Promise<UsersResponse | undefined>;
  signOut: () => Promise<PBClearResponse | undefined>;
};

interface AuthContextProviderProps {
  children: ReactNode;
}

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const pbClient = useMemo(
    () => new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL),
    []
  );
  const [isValid, setIsValid] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsValid(pbClient.authStore.isValid);
    setUser(pbClient.authStore.model as User | null);
  }, [pbClient]);

  const signInWithPassword = async (username: string, password: string) => {
    const usersResponse = await authWithPasswordAndCookie({
      username,
      password,
      pbClient,
    });
    setIsValid(pbClient.authStore.isValid);
    setUser(pbClient.authStore.model as User | null);
    return usersResponse;
  };

  const signOut = async () => {
    const pbClearResponse = await clearAuthStoreAndCookie({ pbClient });
    setIsValid(pbClient.authStore.isValid);
    setUser(pbClient.authStore.model as User | null);
    return pbClearResponse;
  };

  const context = {
    isValid,
    user,
    pbClient,
    signInWithPassword,
    signOut,
  } as AuthContextType;

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}
