import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  AcademicMaterialsCustomResponse,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
} from "src/types/raito";
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
        className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
      >
        <td>
          <Link
            className="block w-6 truncate p-2 text-right"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {index + 1}
          </Link>
        </td>
        <td>
          <Link
            className="block w-full max-w-xs truncate p-2"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {academicMaterial.expand?.userDocument_name}
          </Link>
        </td>
        <td>
          <Link
            className="block w-full max-w-xs truncate p-2"
            href={`/academicMaterials/${encodeURIComponent(
              academicMaterial.id
            )}`}
          >
            {academicMaterial.category}
          </Link>
        </td>
        <td>
          <Link
            className="block w-32 truncate p-2"
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
            className="block w-32 truncate p-2"
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
            className="block w-10 truncate px-2 py-1"
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
          <tr>
            <th className="!static w-6 p-2">No.</th>
            <th className="max-w-xs truncate p-2">Material title</th>
            <th className="max-w-xs truncate p-2">Category</th>
            <th className="w-32 truncate p-2">Priority</th>
            <th className="w-32 truncate p-2">Status</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{pastEventsList}</tbody>
      </table>
    </div>
  );
}

export default AcademicMaterialsTable;
