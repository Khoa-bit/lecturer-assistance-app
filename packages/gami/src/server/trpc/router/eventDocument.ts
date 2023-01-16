import type { EventDocumentsResponse } from "raito";
import { Collections } from "raito";
import { getPBServer } from "src/lib/pb_server";

import { protectedProcedure, router } from "../trpc";

export const eventDocumentRouter = router({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.isValid) return null;
    const pbServer = await getPBServer(ctx.req, ctx.res);
    return pbServer
      .collection(Collections.EventDocuments)
      .getList<EventDocumentsResponse>(1, 50, {
        expand: "document",
      });
  }),
});
