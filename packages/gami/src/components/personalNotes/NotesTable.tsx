import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  PersonalNotesCustomResponse,
} from "raito";
import Priority from "../documents/Priority";
import Status from "../documents/Status";

interface PersonalNotesTableProps {
  personalNotes: ListResult<PersonalNotesCustomResponse>;
}

function PersonalNotesTable({ personalNotes }: PersonalNotesTableProps) {
  const personalNotesList = personalNotes.items.map((personalNote, index) => (
    <tr
      key={personalNote.id}
      className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="block w-6 truncate p-2 text-right"
          href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}
        >
          {personalNote.expand?.userDocument_name}
        </Link>
      </td>
      <td>
        <Link
          className="block w-32 truncate p-2"
          href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}
        >
          <Priority
            width={32}
            height={32}
            priority={
              personalNote.expand
                .userDocument_priority as DocumentsPriorityOptions
            }
          ></Priority>
        </Link>
      </td>
      <td>
        <Link
          className="block w-32 truncate p-2"
          href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}
        >
          <Status
            status={
              personalNote.expand.userDocument_status as DocumentsStatusOptions
            }
          ></Status>
        </Link>
      </td>
      <td>
        <Link
          className="block w-10 truncate py-1 px-2"
          href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}
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
            <th className="max-w-xs truncate p-2">Note name</th>
            <th className="w-32 truncate p-2">Priority</th>
            <th className="w-32 truncate p-2">Status</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{personalNotesList}</tbody>
      </table>
    </div>
  );
}

export default PersonalNotesTable;
