import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { EventDocumentsCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface EventsData {
  events: ListResult<EventDocumentsCustomResponse>;
}

function EventDocuments({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<EventsData>(data);

  const eventsList = dataParse.events.items.map((eventDoc) => (
    <li key={eventDoc.id}>
      <Link href={`/eventDocuments/${encodeURIComponent(eventDoc.id)}`}>
        {JSON.stringify(eventDoc.expand.documents_name)}
      </Link>
    </li>
  )) ?? <p>{"Error when fetching event documents :<"}</p>;

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <h1>Events</h1>
      <Link className="text-blue-700 underline" href="/eventDocuments/new">
        New event document
      </Link>
      <ol>{eventsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const events = await pbServer.apiGetList<EventDocumentsCustomResponse>(
    "/api/user/eventDocuments"
  );

  return {
    props: {
      data: SuperJSON.stringify({ events }),
    },
  };
};

EventDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocuments;
