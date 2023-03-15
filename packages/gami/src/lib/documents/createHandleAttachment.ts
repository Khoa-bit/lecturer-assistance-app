import type { AttachmentsResponse } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { PBCustom } from "src/types/pb-custom";
import { isFulfilled, isRejected } from "../promises/checkState";

export function createHandleAttachment(
  pbClient: PBCustom,
  documentId: string,
  setCurAttachments: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>
) {
  const handleAttachment = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const createPromises = Object.values(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document", documentId);
      return await pbClient
        .collection(Collections.Attachments)
        .create<AttachmentsResponse>(formData, {
          $autoCancel: false,
        });
    });
    const results = await Promise.allSettled<AttachmentsResponse>(
      createPromises
    );

    const fulfilledValues = results.filter(isFulfilled).map((p) => p.value);
    const rejectedReasons = results.filter(isRejected).map((p) => p.reason);

    if (rejectedReasons.length) {
      console.error(rejectedReasons);
    }

    setCurAttachments((curAttachments) => [
      ...curAttachments,
      ...fulfilledValues,
    ]);
  };
  return handleAttachment;
}
