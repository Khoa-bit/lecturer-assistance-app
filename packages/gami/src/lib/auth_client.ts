import type PocketBase from "pocketbase";
import type { UsersResponse } from "raito";
import { Collections } from "raito";
import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";
import type { AuthContextType } from "src/contexts/AuthContextProvider";
import type { PBClearResponse } from "src/pages/api/auth/pbClear";

interface AuthWithPasswordAndCookieArgs {
  username: string;
  password: string;
  pbClient: PocketBase;
}

interface AuthWithOAuthAndCookieArgs {
  provider: string;
  pbClient: PocketBase;
}

interface requestEmailVerificationArgs {
  email: string;
  pbClient: PocketBase;
}

interface confirmEmailVerificationArgs {
  token: string;
  pbClient: PocketBase;
}

interface requestPasswordResetEmailArgs {
  email: string;
  pbClient: PocketBase;
}

interface confirmPasswordResetEmailArgs {
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
  pbClient: PocketBase;
}

interface ClearAuthStoreAndCookieArgs {
  pbClient: PocketBase;
}

export async function _authWithPasswordAndCookie({
  username,
  password,
  pbClient,
}: AuthWithPasswordAndCookieArgs): Promise<UsersResponse> {
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

export async function _authWithOAuth2AndCookie({
  provider,
  pbClient,
}: AuthWithOAuthAndCookieArgs): Promise<UsersResponse> {
  return await pbClient
    .collection(Collections.Users)
    .authWithOAuth2<UsersResponse>({
      provider,
    })
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

export async function _clearAuthStoreAndCookie({
  pbClient,
}: ClearAuthStoreAndCookieArgs): Promise<PBClearResponse> {
  return await fetch("/api/auth/pbClear/", { method: "PUT" })
    .then((res) => {
      pbClient.authStore.clear();
      return res.json() as Promise<PBClearResponse>;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function _requestEmailVerification({
  email,
  pbClient,
}: requestEmailVerificationArgs): Promise<boolean> {
  return await pbClient
    .collection(Collections.Users)
    .requestVerification(email)
    .then((hasSent) => {
      return hasSent;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function _confirmEmailVerification({
  token,
  pbClient,
}: confirmEmailVerificationArgs): Promise<boolean> {
  return await pbClient
    .collection(Collections.Users)
    .confirmVerification(token)
    .then((isConfirmed) => {
      return isConfirmed;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function _requestPasswordResetEmail({
  email,
  pbClient,
}: requestPasswordResetEmailArgs): Promise<boolean> {
  return await pbClient
    .collection(Collections.Users)
    .requestPasswordReset(email)
    .then((hasSent) => {
      return hasSent;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export async function _confirmPasswordResetEmail({
  token,
  newPassword,
  newPasswordConfirm,
  pbClient,
}: confirmPasswordResetEmailArgs): Promise<boolean> {
  return await pbClient
    .collection(Collections.Users)
    .confirmPasswordReset(token, newPassword, newPasswordConfirm)
    .then((isSuccess) => {
      return isSuccess;
    })
    .catch((err: Error) => {
      throw err;
    });
}

export function useAuthContext(): AuthContextType {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined. Missing AuthContextProvider for the current scope."
    );
  }
  return authContext;
}
