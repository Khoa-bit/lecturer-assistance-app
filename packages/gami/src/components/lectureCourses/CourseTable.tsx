import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { ClassesCustomResponse, CoursesCustomResponse } from "raito";

interface CoursesTableProps {
  lectureCourses: ListResult<CoursesCustomResponse>;
}

function CoursesTable({ lectureCourses }: CoursesTableProps) {
  const lectureCoursesList = lectureCourses.items.map(
    (lectureCourse, index) => (
      <tr
        key={lectureCourse.id}
        className="grid grid-cols-[3rem_2fr_1fr_1fr_2rem] rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
      >
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {index + 1}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.expand.courseTemplate_name}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.semester}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
            href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}
          >
            {lectureCourse.expand.courseTemplate_periodsCount}
          </Link>
        </td>
        <td>
          <Link
            className="group inline-block h-full w-full"
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
          <tr className="grid grid-cols-[3rem_2fr_1fr_1fr_2rem] p-3">
            <th className="!static">No.</th>
            <th>Course name</th>
            <th>Semester</th>
            <th>No. periods</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{lectureCoursesList}</tbody>
      </table>
    </div>
  );
}

export default CoursesTable;
