import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
} from "src/types/raito";
import { formatDate } from "src/lib/input_handling";
import StatusEvent, { eventStatus } from "../documents/StatusEvent";

interface FullDocumentExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

interface EventsTableProps {
  eventDocuments: ListResult<EventDocumentsResponse<FullDocumentExpand>>;
}

function EventsTable({ eventDocuments }: EventsTableProps) {
  const pastEventsList = eventDocuments.items.map((eventDoc, index) => (
    <tr
      key={eventDoc.id}
      className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="block w-6 truncate p-2 text-right"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {eventDoc.expand?.fullDocument.expand?.document.name}
        </Link>
      </td>
      <td>
        <Link
          className="flex w-28 justify-center truncate p-2"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          <StatusEvent
            status={eventStatus(
              eventDoc.expand?.fullDocument.expand?.document?.status,
              eventDoc.expand?.fullDocument.expand?.document.startTime,
              eventDoc.expand?.fullDocument.expand?.document.endTime
            )}
          ></StatusEvent>
        </Link>
      </td>
      <td>
        <Link
          className="block w-44 truncate p-2"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {formatDate(
            eventDoc.expand?.fullDocument.expand?.document.startTime,
            "HH:mm - dd/LL/yy"
          )}
        </Link>
      </td>
      <td>
        <Link
          className="block w-44 truncate p-2"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {formatDate(
            eventDoc.expand?.fullDocument.expand?.document.endTime,
            "HH:mm - dd/LL/yy"
          )}
        </Link>
      </td>
      <td>
        <Link
          className="block w-10 truncate px-2 py-1"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="overflow-x-auto">
      <table className="table w-full whitespace-nowrap">
        <thead className="border-b text-left">
          <tr>
            <th className="!static w-6 p-2">No.</th>
            <th className="max-w-xs truncate p-2">Event title</th>
            <th className="w-28 truncate p-2"></th>
            <th className="w-44 truncate p-2">Start time</th>
            <th className="w-44 truncate p-2">End time</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{pastEventsList}</tbody>
      </table>
    </div>
  );
}

export default EventsTable;
