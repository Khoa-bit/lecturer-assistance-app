import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  AcademicMaterialsCustomResponse,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
} from "raito";
import Priority from "../documents/Priority";
import Status from "../documents/Status";

interface AcademicMaterialsTableProps {
  academicMaterials: ListResult<AcademicMaterialsCustomResponse>;
}

function AcademicMaterialsTable({
  academicMaterials,
}: AcademicMaterialsTableProps) {
  const pastEventsList = academicMaterials.items.map(
    (academicMaterial, index) => (
      <tr
        key={academicMaterial.id}
        className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_2rem] gap-2 rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
      >
        <td className="">
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {index + 1}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {academicMaterial.expand?.userDocument_name}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {academicMaterial.category}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            <Priority
              width={32}
              height={32}
              priority={
                academicMaterial.expand
                  .userDocument_priority as DocumentsPriorityOptions
              }
            ></Priority>
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            <Status
              status={
                academicMaterial.expand
                  .userDocument_status as DocumentsStatusOptions
              }
            ></Status>
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            <span className="material-symbols-rounded">chevron_right</span>
          </Link>
        </td>
      </tr>
    )
  );

  return (
    <div className="overflow-x-auto">
      <table className="table w-full whitespace-nowrap">
        <thead className="border-b text-left">
          <tr className="grid grid-cols-[3rem_2fr_1fr_1fr_1fr_2rem] gap-2 p-3">
            <th className="!static">No.</th>
            <th>Material title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{pastEventsList}</tbody>
      </table>
    </div>
  );
}

export default AcademicMaterialsTable;
