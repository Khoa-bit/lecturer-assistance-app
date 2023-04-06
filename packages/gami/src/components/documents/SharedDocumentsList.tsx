import Link from "next/link";
import type { ListResult } from "pocketbase";
import { FullDocumentsInternalOptions } from "raito";
import type { SharedDocumentsCustomResponse } from "raito";
import { sortDate } from "src/lib/input_handling";

interface ParticipateDetailListProps {
  sharedDocuments: ListResult<SharedDocumentsCustomResponse>;
}

function SharedDocumentsList({ sharedDocuments }: ParticipateDetailListProps) {
  return (
    <div className="my-4 flex h-fit flex-col rounded-lg bg-white py-5 px-6">
      <h2 className="flex border-0 border-b-4 p-2 font-semibold text-gray-600">
        Shared documents
      </h2>
      <ol>
        {sharedDocuments.items
          .filter(
            (sharedDocument) =>
              sharedDocument.internal != FullDocumentsInternalOptions.Event
          )
          .sort((a, b) =>
            sortDate(
              new Date(a.expand.userDocument_updated),
              new Date(b.expand.userDocument_updated),
              true
            )
          )
          .map((sharedDocument) => {
            return (
              <li key={sharedDocument.id}>
                <Link
                  className="flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-50"
                  href={`/fullDocuments/${encodeURIComponent(
                    sharedDocument.id
                  )}`}
                >
                  <p className="flex flex-grow flex-col font-semibold">
                    {sharedDocument.expand.userDocument_name}
                  </p>
                  <p className="w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                    {sharedDocument.expand.participant_permission}
                  </p>
                  <span className="material-symbols-rounded">
                    chevron_right
                  </span>
                </Link>
              </li>
            );
          })}
      </ol>
      <h2 className="flex border-0 border-b-4 p-2 font-semibold text-gray-600">
        Shared events
      </h2>
      <ol>
        {sharedDocuments.items
          .filter(
            (sharedDocument) =>
              sharedDocument.internal == FullDocumentsInternalOptions.Event
          )
          .sort((a, b) =>
            sortDate(
              new Date(a.expand.userDocument_updated),
              new Date(b.expand.userDocument_updated),
              true
            )
          )
          .map((sharedDocument) => {
            return (
              <li key={sharedDocument.id}>
                <Link
                  className="flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-50"
                  href={`/fullDocuments/${encodeURIComponent(
                    sharedDocument.id
                  )}`}
                >
                  <p className="flex flex-grow flex-col font-semibold">
                    {sharedDocument.expand.userDocument_name}
                  </p>
                  <p className="w-fit rounded bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                    {sharedDocument.expand.participant_permission}
                  </p>
                  <span className="material-symbols-rounded">
                    chevron_right
                  </span>
                </Link>
              </li>
            );
          })}
      </ol>
    </div>
  );
}

export default SharedDocumentsList;
