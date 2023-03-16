import type { DocumentsResponse } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { PBCustom } from "src/types/pb-custom";

export function createHandleThumbnail(
  pbClient: PBCustom,
  documentId: string,
  setThumbnail: Dispatch<SetStateAction<string | undefined>>
) {
  const handleThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    const thumbnailDoc = await pbClient
      .collection(Collections.Documents)
      .update<DocumentsResponse>(documentId, formData);
    setThumbnail(thumbnailDoc.thumbnail);
  };
  return handleThumbnail;
}
