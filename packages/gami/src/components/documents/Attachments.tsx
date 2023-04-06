import Link from "next/link";
import type { AttachmentsResponse } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction } from "react";
import { categorizeFile } from "src/lib/input_handling";
import type { PBCustom } from "src/types/pb-custom";

function Attachments({
  attachments,
  setAttachments,
  pbClient,
  disabled,
}: {
  attachments: AttachmentsResponse<unknown>[];
  setAttachments?: Dispatch<SetStateAction<AttachmentsResponse<unknown>[]>>;
  pbClient?: PBCustom;
  disabled: boolean;
}) {
  const showDelete = pbClient && setAttachments && !disabled;

  if (attachments.length == 0) return <></>;

  return (
    <ol className="col-span-2 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <li
          className="flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 shadow"
          key={attachment.id}
        >
          <span
            className={`material-symbols-rounded [font-variation-settings:'FILL'_1]
            ${categorizeFile(attachment.file).color}`}
          >
            {categorizeFile(attachment.file).fileExtension.valueOf()}
          </span>
          <Link
            className="max-w-[8rem] truncate"
            href={pbClient?.getFileUrl(attachment, attachment.file) ?? "#"}
            target={"_blank"}
            title={attachment.file}
          >
            {attachment.file}
          </Link>
          {showDelete && (
            <button
              className="h-6"
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
              <span className="material-symbols-rounded text-gray-500 [font-variation-settings:'FILL'_1] hover:text-red-400">
                close
              </span>
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}

export default Attachments;
