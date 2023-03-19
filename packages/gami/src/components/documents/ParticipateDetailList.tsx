import Link from "next/link";
import type { ParticipantsCustomResponse } from "raito";

interface ParticipateDetailListProps {
  participant: ParticipantsCustomResponse;
}

function ParticipateDetailList({ participant }: ParticipateDetailListProps) {
  return (
    <ol key={participant.id}>
      {participant.expand.fullDocument_id_list.map((fullDocId, index) => {
        if (fullDocId.length <= 0) return <></>;

        return (
          <li key={fullDocId}>
            <Link href={`/fullDocuments/${encodeURIComponent(fullDocId)}`}>
              {participant.expand.userDocument_name_list.at(index)}
            </Link>
            <span>{` - ${participant.expand.participant_permission_list.at(
              index
            )}`}</span>
          </li>
        );
      })}
      {participant.expand.eventDocument_id_list.map((eventDocId, index) => {
        if (eventDocId.length <= 0) return <></>;

        return (
          <li key={eventDocId}>
            <Link href={`/eventDocuments/${encodeURIComponent(eventDocId)}`}>
              {participant.expand.userDocument_name_list.at(index)}
            </Link>
            <span>{` - ${participant.expand.participant_permission_list.at(
              index
            )}`}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default ParticipateDetailList;
