import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  PersonalNotesCustomResponse,
} from "raito";
import Priority from "src/components/documents/Priority";
import Status from "src/components/documents/Status";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { formatDate } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface PersonalNotesData {
  personalNotes: ListResult<PersonalNotesCustomResponse>;
  participatedPersonalNotes: ListResult<PersonalNotesCustomResponse>;
}

function PersonalNotes({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<PersonalNotesData>(data);
  const personalNotes = dataParse.personalNotes;
  const participatedPersonalNotes = dataParse.participatedPersonalNotes;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>Personal Notes</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Personal notes</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/personalNotes/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          personal note
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="My personal notes"
          initData={personalNotes}
          columns={initPersonalNotesColumns()}
        ></IndexTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Participate personal notes"
          initData={participatedPersonalNotes}
          columns={initPersonalNotesColumns()}
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

  const personalNotes = await pbServer.apiGetList<PersonalNotesCustomResponse>(
    "/api/user/getPersonalNotes"
  );

  const participatedPersonalNotes =
    await pbServer.apiGetList<PersonalNotesCustomResponse>(
      "/api/user/getParticipatedPersonalNotes?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        personalNotes,
        participatedPersonalNotes,
      } as PersonalNotesData),
    },
  };
};

function initPersonalNotesColumns(): ColumnDef<PersonalNotesCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/personalNotes/${encodeURIComponent(lectureCourseId)}`;

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

PersonalNotes.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PersonalNotes;
