import type { NextApiHandler } from "next";
import PocketBase from "pocketbase";
import { env } from "src/env/client.mjs";

export interface PBClearResponse {
  message: string;
}

const handler: NextApiHandler<PBClearResponse> = (req, res) => {
  if (req.method === "PUT") {
    if (req.cookies["pb_auth"] == null) {
      res.status(200).json({ message: "Already signed out" });
      return true;
    }

    const pbClient = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);
    pbClient.authStore.loadFromCookie("");
    res.setHeader("set-cookie", pbClient.authStore.exportToCookie());
    res.status(200).json({ message: "Cookie signed out successfully" });
    return true;
  }

  res.status(400).json({ message: "Not a PUT request" });
  return false;
};

export default handler;
