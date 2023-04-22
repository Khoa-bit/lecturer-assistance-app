import { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { CoursesCustomResponse, DocumentsStatusOptions } from "raito";
import Status from "src/components/documents/Status";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexFooterCell from "src/components/tanstackTable/IndexFooterCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
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
        <IndexTable
          heading="My lecture courses"
          initData={lectureCourses}
          columns={initCourseColumns(lectureCourses)}
        ></IndexTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Participate lecture courses"
          initData={participatedLectureCourses}
          columns={initCourseColumns(participatedLectureCourses)}
        ></IndexTable>
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

function initCourseColumns(
  lectureCourses: ListResult<CoursesCustomResponse>
): ColumnDef<CoursesCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/lectureCourses/${encodeURIComponent(lectureCourseId)}`;

  return [
    {
      accessorFn: (item) => item.expand.courseTemplate_name,
      id: "courseTemplate_name",
      cell: (info) => (
        <IndexCell
          className="min-w-[20rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[20rem]">Course name</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.courseTemplate_academicProgram,
      id: "courseTemplate_academicProgram",
      cell: (info) => (
        <IndexCell
          className="min-w-[11rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[11rem]">
          Academic program
        </IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.semester,
      id: "semester",
      cell: (info) => (
        <IndexCell
          className="min-w-[13rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[13rem]">Semester</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.courseTemplate_periodsCount,
      id: "courseTemplate_periodsCount",
      cell: (info) => (
        <IndexCell
          className="min-w-[13rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[13rem]">Periods</IndexHeaderCell>
      ),
      footer: (info) => (
        <IndexFooterCell className="min-w-[13rem]">{`Sum: ${info.table
          .getPrePaginationRowModel()
          .rows.reduce(
            (prev, curr) =>
              prev +
              parseInt(curr.getValue("courseTemplate_periodsCount") as string),
            0
          )}`}</IndexFooterCell>
      ),
    },
    {
      accessorFn: (item) => item.expand.userDocument_status,
      id: "userDocument_status",
      cell: (info) => (
        <IndexCell
          className="min-w-[8rem]"
          href={getHref(info.row.original.id)}
        >
          <Status status={info.getValue() as DocumentsStatusOptions}></Status>
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[8rem]">Status</IndexHeaderCell>
      ),
      footer: () => null,
    },
  ];
}

LectureCourses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LectureCourses;
