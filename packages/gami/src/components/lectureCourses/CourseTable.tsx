import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { CoursesCustomResponse } from "raito";

interface CoursesTableProps {
  lectureCourses: ListResult<CoursesCustomResponse>;
}

function CoursesTable({ lectureCourses }: CoursesTableProps) {
  const lectureCoursesList = lectureCourses.items.map(
    (lectureCourse, index) => (
      <tr
        key={lectureCourse.id}
        className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
      >
        <td>
          <Link
            className="block w-6 truncate p-2 text-right"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {index + 1}
          </Link>
        </td>
        <td>
          <Link
            className="block w-full max-w-xs truncate p-2"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.expand.courseTemplate_name}
          </Link>
        </td>
        <td>
          <Link
            className="block w-44 truncate p-2"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.expand.courseTemplate_academicProgram}
          </Link>
        </td>
        <td>
          <Link
            className="block w-56 truncate p-2"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.semester}
          </Link>
        </td>
        <td>
          <Link
            className="block w-20 truncate p-2"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.expand.courseTemplate_periodsCount}
          </Link>
        </td>
        <td>
          <Link
            className="block w-10 truncate py-1 px-2"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
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
            <th className="max-w-xs truncate p-2">Course name</th>
            <th className="w-44 truncate p-2">Academic program</th>
            <th className="w-56 truncate p-2">Semester</th>
            <th className="w-20 truncate p-2">Periods</th>
            <th className="w-10 truncate p-2"></th>
          </tr>
        </thead>
        <tbody>{lectureCoursesList}</tbody>
      </table>
    </div>
  );
}

export default CoursesTable;
