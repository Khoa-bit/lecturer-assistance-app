import { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { BaseSystemFields, CoursesCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import CoursesTable from "src/components/lectureCourses/CourseTable";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface LectureCoursesData {
  lectureCourses: ListResult<CoursesCustomResponse>;
  participatedLectureCourses: ListResult<CoursesCustomResponse>;
  pbAuthCookie: string;
}

function LectureCourses({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<LectureCoursesData>(data);
  const lectureCourses = dataParse.lectureCourses;
  const participatedLectureCourses = dataParse.participatedLectureCourses;

  const getHref = (lectureCourseId: string) =>
    `/lectureCourses/${encodeURIComponent(lectureCourseId)}`;

  const columns: ColumnDef<CoursesCustomResponse>[] = [
    {
      accessorFn: (item) => item.expand.courseTemplate_name,
      id: "courseTemplate_name",
      cell: (info) => (
        <Link
          className="block w-64 truncate px-2 py-1"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </Link>
      ),
      header: () => <p className="w-64">Course name</p>,
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.courseTemplate_academicProgram,
      id: "courseTemplate_academicProgram",
      cell: (info) => (
        <Link
          className="block w-40 truncate px-2 py-1"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </Link>
      ),
      header: () => <p className="w-40">Academic program</p>,
      footer: () => null,
    },
    {
      accessorFn: (item) => item.semester,
      id: "semester",
      cell: (info) => (
        <Link
          className="block w-52 truncate px-2 py-1"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </Link>
      ),
      header: () => <p className="w-52">Semester</p>,
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.courseTemplate_periodsCount,
      id: "courseTemplate_periodsCount",
      cell: (info) => (
        <Link
          className="block w-52 truncate px-2 py-1"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </Link>
      ),
      header: () => <p className="w-52">Periods</p>,
      footer: () =>
        `Sum: ${lectureCourses?.items.reduce(
          (prev, curr) =>
            prev + parseInt(curr.expand.courseTemplate_periodsCount),
          0
        )}`,
    },
  ];

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>LectureCourses</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Lecture courses</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/lectureCourses/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          lecture course
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable initData={lectureCourses} columns={columns}></IndexTable>
      </section>

      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          My lecture courses
        </h2>
        <CoursesTable lectureCourses={lectureCourses}></CoursesTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Participate lecture courses
        </h2>
        <CoursesTable
          lectureCourses={participatedLectureCourses}
        ></CoursesTable>
      </section>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const lectureCourses = await pbServer.apiGetList<CoursesCustomResponse>(
    "/api/user/getCourses"
  );

  const participatedLectureCourses =
    await pbServer.apiGetList<CoursesCustomResponse>(
      "/api/user/getParticipatedCourses?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        lectureCourses,
        participatedLectureCourses,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as LectureCoursesData),
    },
  };
};

LectureCourses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LectureCourses;
