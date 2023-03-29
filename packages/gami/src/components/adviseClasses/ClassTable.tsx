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
      className="grid grid-cols-[3rem_2fr_minmax(20rem,1fr)_1fr_1fr_2rem] rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.expand?.userDocument_name}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.expand.major_name}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.trainingSystem}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}
        >
          {adviseClass.cohort}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
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
          <tr className="grid grid-cols-[3rem_2fr_minmax(20rem,1fr)_1fr_1fr_2rem] p-3">
            <th className="!static">No.</th>
            <th>Class name</th>
            <th>Major</th>
            <th>Training system</th>
            <th>Cohort</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{adviseClassesList}</tbody>
      </table>
    </div>
  );
}

export default AdviseClassesTable;
