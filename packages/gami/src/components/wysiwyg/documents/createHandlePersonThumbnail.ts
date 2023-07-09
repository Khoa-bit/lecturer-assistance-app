import type { PeopleResponse } from "src/types/raito";
import { Collections } from "src/types/raito";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { PBCustom } from "src/types/pb-custom";

export function createHandlePersonThumbnail(
  pbClient: PBCustom,
  personId: string,
  setThumbnail: Dispatch<SetStateAction<string | undefined>>
) {
  const handleThumbnail = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);

    const personThumbnail = await pbClient
      .collection(Collections.People)
      .update<PeopleResponse>(personId, formData);

    setThumbnail(personThumbnail.thumbnail);
  };
  return handleThumbnail;
}
