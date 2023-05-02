import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { ClassesCustomResponse, DocumentsStatusOptions } from "raito";
import Status from "src/components/documents/Status";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface AdviseClassesData {
  adviseClasses: ListResult<ClassesCustomResponse>;
  participatedAdviseClasses: ListResult<ClassesCustomResponse>;
}

function AdviseClasses({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<AdviseClassesData>(data);
  const adviseClasses = dataParse.adviseClasses;
  const participatedAdviseClasses = dataParse.participatedAdviseClasses;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>Advise Classes</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Advise classes</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/adviseClasses/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          advise class
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="My academic materials"
          initData={adviseClasses}
          columns={initClassesColumns()}
        ></IndexTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Participate academic materials"
          initData={participatedAdviseClasses}
          columns={initClassesColumns()}
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

  const adviseClasses = await pbServer.apiGetList<ClassesCustomResponse>(
    "/api/user/getClasses"
  );

  const participatedAdviseClasses =
    await pbServer.apiGetList<ClassesCustomResponse>(
      "/api/user/getParticipatedClasses?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        adviseClasses,
        participatedAdviseClasses,
      } as AdviseClassesData),
    },
  };
};

function initClassesColumns(): ColumnDef<ClassesCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/adviseClasses/${encodeURIComponent(lectureCourseId)}`;

  return [
    {
      accessorFn: (item) => item.expand?.userDocument_name,
      id: "userDocument_name",
      cell: (info) => (
        <IndexCell
          className="min-w-[20rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[20rem]">
          Material title
        </IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.major_name,
      id: "major_name",
      cell: (info) => (
        <IndexCell
          className="min-w-[12rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[12rem]">Major</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.academicProgram,
      id: "academicProgram",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">
          Academic program
        </IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.cohort,
      id: "cohort",
      cell: (info) => (
        <IndexCell
          className="min-w-[8rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[8rem]">Cohort</IndexHeaderCell>
      ),
      footer: () => null,
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

AdviseClasses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AdviseClasses;
