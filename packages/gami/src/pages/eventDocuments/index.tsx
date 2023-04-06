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
import EventsTable from "src/components/eventDocuments/EventsTable";
import MainLayout from "src/components/layouts/MainLayout";
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
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
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
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Upcoming events list
        </h2>
        <EventsTable eventDocuments={upcomingEventDocuments}></EventsTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Past events list
        </h2>
        <EventsTable eventDocuments={pastEventDocuments}></EventsTable>
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

EventDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocuments;
