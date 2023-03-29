import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { PeopleResponse, UsersResponse } from "raito";

interface UsersExpand {
  "users(person)": UsersResponse;
}

interface PeopleTableProps {
  people: ListResult<PeopleResponse<UsersExpand>>;
}

function PeopleTable({ people }: PeopleTableProps) {
  const peopleList = people.items.map((person, index) => (
    <tr
      key={person.id}
      className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_2rem] rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.name}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.personId}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.title}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {[person.personalEmail, person.expand?.["users(person)"]?.email]
            .filter((email) => email != undefined && email != "")
            .join(", ")}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
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
          <tr className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_2rem] p-3">
            <th className="!static">No.</th>
            <th>Name</th>
            <th>ID</th>
            <th>Position</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{peopleList}</tbody>
      </table>
    </div>
  );
}

export default PeopleTable;
