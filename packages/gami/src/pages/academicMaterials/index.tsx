import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  AcademicMaterialsCustomResponse,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
} from "raito";
import { useMemo } from "react";
import Priority from "src/components/documents/Priority";
import Status from "src/components/documents/Status";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { formatDate } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface AcademicMaterialsData {
  academicMaterials: ListResult<AcademicMaterialsCustomResponse>;
  participatedAcademicMaterials: ListResult<AcademicMaterialsCustomResponse>;
}

function AcademicMaterials({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<AcademicMaterialsData>(data);
  const academicMaterials = dataParse.academicMaterials;
  const participatedAcademicMaterials = dataParse.participatedAcademicMaterials;
  const academicMaterialColumns = useMemo(
    () => initAcademicMaterialColumns(),
    []
  );

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>Academic materials</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Academic materials</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/academicMaterials/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          academic materials
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="My academic materials"
          initData={academicMaterials}
          columns={academicMaterialColumns}
        ></IndexTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Participate academic materials"
          initData={participatedAcademicMaterials}
          columns={academicMaterialColumns}
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

  const academicMaterials =
    await pbServer.apiGetList<AcademicMaterialsCustomResponse>(
      "/api/user/getAcademicMaterials"
    );

  const participatedAcademicMaterials =
    await pbServer.apiGetList<AcademicMaterialsCustomResponse>(
      "/api/user/getParticipatedAcademicMaterials?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        academicMaterials,
        participatedAcademicMaterials,
      } as AcademicMaterialsData),
    },
  };
};

function initAcademicMaterialColumns(): ColumnDef<AcademicMaterialsCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/academicMaterials/${encodeURIComponent(lectureCourseId)}`;

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
      accessorFn: (item) => item.category,
      id: "category",
      cell: (info) => (
        <IndexCell
          className="min-w-[9rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[9rem]">Category</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand.userDocument_priority,
      id: "userDocument_priority",
      cell: (info) => (
        <IndexCell
          className="min-w-[8rem]"
          href={getHref(info.row.original.id)}
        >
          <Priority
            width={32}
            height={32}
            priority={info.getValue() as DocumentsPriorityOptions}
          ></Priority>
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[8rem]">Priority</IndexHeaderCell>
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

    {
      accessorFn: (item) =>
        formatDate(item.expand?.userDocument_startTime, "HH:mm - dd/LL/yy"),
      id: "startTime",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">Start time</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) =>
        formatDate(item.expand?.userDocument_endTime, "HH:mm - dd/LL/yy"),
      id: "endTime",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">End time</IndexHeaderCell>
      ),
      footer: () => null,
    },
  ];
}

AcademicMaterials.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AcademicMaterials;
