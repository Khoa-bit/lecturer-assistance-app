import Link from "next/link";
import type { AttachmentsResponse } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction } from "react";
import type { PBCustom } from "src/types/pb-custom";

function Attachments({
  attachments,
  setAttachments,
  pbClient,
}: {
  attachments: AttachmentsResponse<unknown>[];
  setAttachments?: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>;
  pbClient?: PBCustom;
}) {
  const showDelete = pbClient && setAttachments;

  return (
    <ol>
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <Link
            href={pbClient?.getFileUrl(attachment, attachment.file) ?? "#"}
            target={"_blank"}
          >
            {attachment.file}
          </Link>
          {showDelete && (
            <button
              onClick={() => {
                pbClient
                  .collection(Collections.Attachments)
                  .delete(attachment.id);

                setAttachments((attachments) =>
                  attachments.filter(
                    (thisAttachment) => thisAttachment.id != attachment.id
                  )
                );
              }}
            >
              {" - Delete"}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}

export default Attachments;
