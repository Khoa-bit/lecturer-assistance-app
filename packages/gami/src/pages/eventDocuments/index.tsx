import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsStatusOptions,
  EventDocumentsCustomResponse,
} from "src/types/raito";
import { ParticipantsStatusOptions } from "src/types/raito";
import type { StatusEventOptions } from "src/components/documents/StatusEvent";
import StatusEvent, { eventStatus } from "src/components/documents/StatusEvent";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { formatDate } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";
import { ParticipationStatus } from "../../components/documents/ParticipationStatus";
import React from "react";

interface EventsData {
  upcomingEventDocuments: ListResult<EventDocumentsCustomResponse>;
  pastEventDocuments: ListResult<EventDocumentsCustomResponse>;
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
          heading="Upcoming events"
          initData={upcomingEventDocuments}
          columns={initEventDocumentColumns()}
        ></IndexTable>
      </section>
      <section className="my-4 w-full rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Past events"
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

  const upcomingEventDocuments =
    await pbServer.apiGetList<EventDocumentsCustomResponse>(
      `/api/user/getUpcomingEvents/?fullList=true`
    );
  const pastEventDocuments =
    await pbServer.apiGetList<EventDocumentsCustomResponse>(
      `/api/user/getPastEvents/?fullList=true`
    );

  return {
    props: {
      data: SuperJSON.stringify({
        upcomingEventDocuments,
        pastEventDocuments,
      } as EventsData),
    },
  };
};

function initEventDocumentColumns(): ColumnDef<EventDocumentsCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/eventDocuments/${encodeURIComponent(lectureCourseId)}`;

  return [
    {
      accessorFn: (item) => item.expand?.document_name,
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
      accessorFn: (item) => {
        if (item.expand.participant_id === "") {
          return ParticipantsStatusOptions.Yes;
        }

        if (item.expand.participant_status === "") {
          return "Undecided";
        } else {
          return item.expand.participant_status;
        }
      },
      id: "participationStatus",
      cell: (info) => (
        <IndexCell
          className="min-w-[7rem]"
          href={getHref(info.row.original.id)}
        >
          <ParticipationStatus
            status={info.getValue() as ParticipantsStatusOptions}
          ></ParticipationStatus>
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[7rem]">Going?</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) =>
        formatDate(item.expand?.document_startTime, "HH:mm - dd/LL/yy"),
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
        formatDate(item.expand?.document_endTime, "HH:mm - dd/LL/yy"),
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
          item.expand?.document_status as DocumentsStatusOptions,
          item.expand?.document_startTime,
          item.expand?.document_endTime
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
