import type { UsersResponse, AttachmentsResponse } from "raito";
import { ParticipantsPermissionOptions } from "raito";
import type { Dispatch, SetStateAction } from "react";
import type { RichText } from "src/types/documents";
import type { PBCustom } from "src/types/pb-custom";
import TipTap from "./TipTap";
import TipTapComment from "./TipTapComment";
import TipTapView from "./TipTapView";

type TipTapByPermissionProps = {
  richText: RichText;
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
  richText,
  user,
  permission,
  documentId,
  pbClient,
  onChange,
  setAttachments,
}: TipTapByPermissionProps) => {
  let tipTapEditor: JSX.Element;

  if (
    permission == ParticipantsPermissionOptions.write &&
    documentId &&
    pbClient &&
    onChange &&
    setAttachments
  ) {
    console.log("TipTap");
    tipTapEditor = (
      <TipTap
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
    console.log("TipTapComment");
    tipTapEditor = (
      <TipTapComment
        key="TipTapComponent"
        onChange={onChange}
        richText={richText}
        user={user}
      ></TipTapComment>
    );
  } else {
    console.log("TipTapView");
    tipTapEditor = (
      <TipTapView
        key="TipTapComponent"
        richText={richText}
        user={user}
      ></TipTapView>
    );
  }

  return tipTapEditor;
};

export default TipTapByPermission;
