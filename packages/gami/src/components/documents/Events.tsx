import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
} from "raito";

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
  isWrite: boolean;
}

function EventsList({
  fullDocumentId,
  upcomingEventDocuments,
  pastEventDocuments,
  isWrite,
}: EventsListProps) {
  return (
    <>
      {isWrite && (
        <p key="newEvent">
          <Link href={`/eventDocuments/new?fullDocId=${fullDocumentId}`}>
            New event
          </Link>
        </p>
      )}
      <p>Upcoming</p>
      <ol>
        {upcomingEventDocuments.items.map((eventDocument) => (
          <li key={eventDocument.id}>
            <Link
              href={`/eventDocuments/${encodeURIComponent(eventDocument.id)}`}
            >
              {`${eventDocument.expand?.fullDocument.expand?.document.status} - ${eventDocument.expand?.fullDocument.expand?.document.name} - ${eventDocument.startTime} - ${eventDocument.endTime} - ${eventDocument.recurring}`}
            </Link>
          </li>
        ))}
      </ol>
      <p>Past</p>
      <ol>
        {pastEventDocuments.items.map((eventDocument) => (
          <li key={eventDocument.id}>
            <Link
              href={`/eventDocuments/${encodeURIComponent(eventDocument.id)}`}
            >
              {`${eventDocument.expand?.fullDocument.expand?.document.status} - ${eventDocument.expand?.fullDocument.expand?.document.name} - ${eventDocument.startTime} - ${eventDocument.endTime} - ${eventDocument.recurring}`}
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

export default EventsList;
