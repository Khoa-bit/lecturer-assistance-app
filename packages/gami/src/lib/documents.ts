import type { ParticipantsResponse } from "raito";
import { Collections, ParticipantsPermissionOptions } from "raito";

type getOwnerRoleType = (
  documentId: string,
  personId: string
) => ParticipantsResponse<object>;

export const getOwnerRole: getOwnerRoleType = (documentId, personId) => {
  return {
    collectionId: "",
    collectionName: Collections.Participants,
    created: "",
    document: documentId,
    id: "documentOwner",
    note: "",
    permission: ParticipantsPermissionOptions.write,
    person: personId,
    role: "",
    updated: "",
    expand: {},
  };
};
