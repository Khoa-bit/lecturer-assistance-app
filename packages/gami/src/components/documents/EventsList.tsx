import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { useState } from "react";
import { formatDate } from "src/lib/input_handling";
import StatusEvent, { StatusEventOptions, eventStatus } from "./StatusEvent";

interface FullDocumentExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}
interface DocumentsExpand {
  document: DocumentsResponse;
}

interface EventsListProps {
  fullDocumentId: string;
  upcomingEventDocuments: ListResult<
    EventDocumentsResponse<FullDocumentExpand>
  >;
  pastEventDocuments: ListResult<EventDocumentsResponse<FullDocumentExpand>>;
  disabled: boolean;
}

function EventsList({
  fullDocumentId,
  upcomingEventDocuments,
  pastEventDocuments,
  disabled,
}: EventsListProps) {
  const [hasOutdatedPast, setHasOutdatedPast] = useState(false);

  return (
    <>
      <h2 className="flex pb-3">
        <strong className="flex-grow text-xl font-semibold text-gray-700">
          Events
        </strong>
        {!disabled && (
          <Link
            className="false flex w-fit cursor-pointer items-center gap-1 rounded border border-gray-300 p-1 text-sm font-semibold hover:bg-gray-50"
            href={`/eventDocuments/new?toFullDocId=${fullDocumentId}`}
          >
            <span className="material-symbols-rounded !text-sm text-gray-500 [font-variation-settings:'FILL'_1,'opsz'_24]">
              add_circle
            </span>
            Add event
          </Link>
        )}
      </h2>
      <section className="collapse">
        <input
          id="upcoming-collapse"
          type="checkbox"
          aria-label="toggle collapse panel"
          defaultChecked={true}
        />
        <h3 className="collapse-title border-0 border-b-4 p-2 font-semibold text-gray-600">
          <label
            htmlFor="upcoming-collapse"
            className={`group flex ${
              upcomingEventDocuments.items.length != 0 && "cursor-pointer"
            }`}
          >
            <span className="flex-grow">Upcoming</span>
            <span
              className={`material-symbols-rounded rounded group-hover:bg-gray-100 ${
                upcomingEventDocuments.items.length == 0 && "!hidden"
              }`}
            >
              expand_more
            </span>
          </label>
        </h3>
        <ol className="collapse-content">
          {upcomingEventDocuments.items.map((eventDocument) => {
            const document =
              eventDocument.expand?.fullDocument.expand?.document;

            const upcomingEventStatus = eventStatus(
              document?.status,
              eventDocument.startTime,
              eventDocument.endTime
            );

            return (
              <li key={eventDocument.id}>
                <Link
                  className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50"
                  href={`/eventDocuments/${encodeURIComponent(
                    eventDocument.id
                  )}`}
                >
                  <p className="flex flex-grow flex-col font-semibold">
                    {document?.name}
                    <small className="flex items-center gap-1 font-normal">
                      {formatDate(eventDocument.startTime, "HH:mm - dd/LL")}
                      <span className="material-symbols-rounded !text-base [font-variation-settings:'opsz'_24]">
                        start
                      </span>
                      {formatDate(eventDocument.endTime, "HH:mm - dd/LL")}
                    </small>
                  </p>
                  <StatusEvent status={upcomingEventStatus}></StatusEvent>
                  <span className="material-symbols-rounded">
                    chevron_right
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="collapse">
        <input
          id="past-collapse"
          type="checkbox"
          aria-label="toggle collapse panel"
        />
        <h3 className="collapse-title border-0 border-b-4 p-2 font-semibold text-gray-600">
          <label
            htmlFor="past-collapse"
            className={`group flex ${
              pastEventDocuments.items.length != 0 && "cursor-pointer"
            }`}
          >
            <span className="flex flex-grow gap-0.5">
              Past
              {hasOutdatedPast && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                </span>
              )}
            </span>
            <span
              className={`material-symbols-rounded rounded group-hover:bg-gray-100 ${
                pastEventDocuments.items.length == 0 && "!hidden"
              }`}
            >
              expand_more
            </span>
          </label>
        </h3>
        <ol className="collapse-content">
          {pastEventDocuments.items.map((eventDocument) => {
            const document =
              eventDocument.expand?.fullDocument.expand?.document;

            const pastEventStatus = eventStatus(
              document?.status,
              eventDocument.startTime,
              eventDocument.endTime
            );

            if (
              !hasOutdatedPast &&
              pastEventStatus == StatusEventOptions.Outdated
            )
              setHasOutdatedPast(true);

            return (
              <li key={eventDocument.id}>
                <Link
                  className="flex items-center gap-2 py-1 px-2 hover:bg-gray-50"
                  href={`/eventDocuments/${encodeURIComponent(
                    eventDocument.id
                  )}`}
                >
                  <p className="flex flex-grow flex-col font-semibold">
                    {document?.name}
                    <small className="flex items-center gap-1 font-normal">
                      {formatDate(eventDocument.startTime, "HH:mm - dd/LL")}
                      <span className="material-symbols-rounded !text-base [font-variation-settings:'opsz'_24]">
                        start
                      </span>
                      {formatDate(eventDocument.endTime, "HH:mm - dd/LL")}
                    </small>
                  </p>
                  <StatusEvent status={pastEventStatus}></StatusEvent>
                  <span className="material-symbols-rounded">
                    chevron_right
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

export default EventsList;
