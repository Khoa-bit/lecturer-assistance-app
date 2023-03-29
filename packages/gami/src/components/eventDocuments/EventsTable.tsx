import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { formatDate } from "src/lib/input_handling";

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
      className="grid grid-cols-[3rem_2fr_1fr_1fr_2rem] rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {eventDoc.expand?.fullDocument.expand?.document.name}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {formatDate(eventDoc.startTime, "HH:mm - dd/LL/yy")}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}
        >
          {formatDate(eventDoc.endTime, "HH:mm - dd/LL/yy")}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
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
          <tr className="grid grid-cols-[3rem_2fr_1fr_1fr_2rem] p-3">
            <th className="!static">No.</th>
            <th>Event title</th>
            <th>Start time</th>
            <th>End time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{pastEventsList}</tbody>
      </table>
    </div>
  );
}

export default EventsTable;
