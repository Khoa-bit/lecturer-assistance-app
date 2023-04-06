import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { ClassesCustomResponse } from "raito";

interface EventsTableProps {
  adviseClasses: ListResult<ClassesCustomResponse>;
}

function AdviseClassesTable({ adviseClasses }: EventsTableProps) {
  const adviseClassesList = adviseClasses.items.map((adviseClass, index) => (
    <tr
      key={adviseClass.id}
      className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="block w-6 truncate p-2 text-right"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.expand?.userDocument_name}
        </Link>
      </td>
      <td>
        <Link
          className="block w-72 truncate p-2"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.expand.major_name}
        </Link>
      </td>
      <td>
        <Link
          className="block w-44 truncate p-2"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.academicProgram}
        </Link>
      </td>
      <td>
        <Link
          className="block w-32 truncate p-2"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.cohort}
        </Link>
      </td>
      <td>
        <Link
          className="block w-10 truncate py-1 px-2"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
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
            <th className="max-w-xs truncate p-2">Class name</th>
            <th className="w-72 truncate p-2">Major</th>
            <th className="w-44 truncate p-2">Academic program</th>
            <th className="w-32 truncate p-2">Cohort</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{adviseClassesList}</tbody>
      </table>
    </div>
  );
}

export default AdviseClassesTable;
