import type { PeopleResponse } from "src/types/raito";
import { Collections } from "src/types/raito";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { PBCustom } from "src/types/pb-custom";

export function createHandleAvatar(
  pbClient: PBCustom,
  personId: string,
  setAvatar: Dispatch<SetStateAction<string | undefined>>
) {
  const handleAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.item(0);
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    const personAvatar = await pbClient
      .collection(Collections.People)
      .update<PeopleResponse>(personId, formData);
    setAvatar(personAvatar.avatar);
  };
  return handleAvatar;
}
