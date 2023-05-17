import type { AttachmentsResponse, UsersResponse } from "raito";
import { ParticipantsPermissionOptions } from "raito";
import type { Dispatch, SetStateAction } from "react";
import type { PBCustom } from "src/types/pb-custom";
import TipTap from "./TipTap";
import TipTapComment from "./TipTapComment";
import TipTapView from "./TipTapView";

type TipTapByPermissionProps = {
  id?: string;
  richText: string;
  user: UsersResponse;
  permission: ParticipantsPermissionOptions;
  documentId?: string;
  pbClient?: PBCustom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (...event: any[]) => void;
  setAttachments?: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>;
};

// Require correct permission and arguments to get the wanted TipTap component
// Or else It will fallback to Read-Only
const TipTapByPermission = ({
  id,
  richText,
  user,
  permission,
  documentId,
  pbClient,
  onChange,
  setAttachments,
}: TipTapByPermissionProps) => {
  let tipTap;

  if (
    permission == ParticipantsPermissionOptions.write &&
    documentId &&
    pbClient &&
    onChange &&
    setAttachments
  ) {
    tipTap = (
      <TipTap
        id={id}
        key="TipTapComponent"
        onChange={onChange}
        richText={richText}
        documentId={documentId}
        pbClient={pbClient}
        user={user}
        setCurAttachments={setAttachments}
      ></TipTap>
    );
  } else if (permission == ParticipantsPermissionOptions.comment && onChange) {
    tipTap = (
      <TipTapComment
        id={id}
        key="TipTapComponent"
        onChange={onChange}
        richText={richText}
        user={user}
      ></TipTapComment>
    );
  } else {
    tipTap = (
      <TipTapView
        id={id}
        key="TipTapComponent"
        richText={richText}
      ></TipTapView>
    );
  }

  return (
    <div className="rounded-btn h-fit resize-y overflow-auto border-2 px-2 py-2 focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2">
      {tipTap}
    </div>
  );
};

export default TipTapByPermission;
