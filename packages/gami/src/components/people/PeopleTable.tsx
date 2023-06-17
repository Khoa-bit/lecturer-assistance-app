import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { PeopleResponse, UsersResponse } from "src/types/raito";
import type { Education, Experience, Interests } from "src/types/peopleJSON";

interface UsersExpand {
  "users(person)": UsersResponse;
}

interface PeopleTableProps {
  people: ListResult<
    PeopleResponse<Education, Experience, Interests, UsersExpand>
  >;
}

function PeopleTable({ people }: PeopleTableProps) {
  const peopleList = people.items.map((person, index) => (
    <tr
      key={person.id}
      className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="block w-6 truncate p-2 text-right"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.name}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.personId}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.title}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {[person.personalEmail, person.expand?.["users(person)"]?.email]
            .filter((email) => email != undefined && email != "")
            .join(", ")}
        </Link>
      </td>
      <td>
        <Link
          className="block w-10 truncate px-2 py-1"
          href={`/people/${encodeURIComponent(person.id)}`}
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
            <th className="max-w-xs truncate p-2">Name</th>
            <th className="max-w-xs truncate p-2">ID</th>
            <th className="max-w-xs truncate p-2">Position</th>
            <th className="max-w-xs truncate p-2">Email</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{peopleList}</tbody>
      </table>
    </div>
  );
}

export default PeopleTable;
