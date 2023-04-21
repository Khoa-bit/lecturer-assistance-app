import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections, EventDocumentsRecurringOptions } from "raito";
import type { StatusEventOptions } from "src/components/documents/StatusEvent";
import StatusEvent, { eventStatus } from "src/components/documents/StatusEvent";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { formatDate } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface FullDocumentExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

interface EventsData {
  upcomingEventDocuments: ListResult<
    EventDocumentsResponse<FullDocumentExpand>
  >;
  pastEventDocuments: ListResult<EventDocumentsResponse<FullDocumentExpand>>;
}

function EventDocuments({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<EventsData>(data);
  const upcomingEventDocuments = dataParse.upcomingEventDocuments;
  const pastEventDocuments = dataParse.pastEventDocuments;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>Events</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Events</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/eventDocuments/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          event document
        </Link>
      </header>
      <section className="my-4 w-full rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Upcoming events list"
          initData={upcomingEventDocuments}
          columns={initEventDocumentColumns()}
        ></IndexTable>
      </section>
      <section className="my-4 w-full rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Past events list"
          initData={pastEventDocuments}
          columns={initEventDocumentColumns()}
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

  const nowISO = new Date().toISOString().replace("T", " ");

  const upcomingEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<FullDocumentExpand>>(undefined, undefined, {
      filter: `fullDocument.document.deleted = "" && (endTime >= "${nowISO}" || recurring != "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "startTime",
    });

  const pastEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<FullDocumentExpand>>(undefined, undefined, {
      filter: `fullDocument.document.deleted = "" && (endTime < "${nowISO}" && recurring = "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "-startTime",
    });

  return {
    props: {
      data: SuperJSON.stringify({
        upcomingEventDocuments,
        pastEventDocuments,
      } as EventsData),
    },
  };
};

function initEventDocumentColumns(): ColumnDef<
  EventDocumentsResponse<FullDocumentExpand>
>[] {
  const getHref = (lectureCourseId: string) =>
    `/eventDocuments/${encodeURIComponent(lectureCourseId)}`;

  return [
    {
      accessorFn: (item) => item.expand?.fullDocument.expand?.document.name,
      id: "name",
      cell: (info) => (
        <IndexCell
          className="min-w-[20rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[20rem]">Event name</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => formatDate(item.startTime, "HH:mm - dd/LL/yy"),
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
      accessorFn: (item) => formatDate(item.endTime, "HH:mm - dd/LL/yy"),
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
    {
      accessorFn: (item) =>
        eventStatus(
          item.expand?.fullDocument.expand?.document?.status,
          item.startTime,
          item.endTime
        ),
      id: "statusEvent",
      cell: (info) => (
        <IndexCell
          className="min-w-[8rem]"
          href={getHref(info.row.original.id)}
        >
          <StatusEvent
            status={info.getValue() as StatusEventOptions}
          ></StatusEvent>
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[8rem]">Status</IndexHeaderCell>
      ),
      footer: () => null,
    },
  ];
}

EventDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocuments;
