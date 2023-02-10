import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { EventDocumentsResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface EventsData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: ListResult<EventDocumentsResponse<any>>;
}

function Events({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data) {
    return <ErrorPage statusCode={404} />;
  }

  const dataParse = SuperJSON.parse<EventsData>(data);

  const eventsList = dataParse.events.items.map((eventDoc) => (
    <li key={eventDoc.id}>{JSON.stringify(eventDoc.expand?.document.name)}</li>
  )) ?? <p>{"Error when fetching event documents :<"}</p>;

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <h1>Events</h1>
      <Link className="text-blue-700 underline" href="/events/new">
        New event
      </Link>
      <ol>{eventsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, res);

  if (!user) return { props: {} };
  const events = await pbServer.apiGetList<EventDocumentsResponse>(
    "/api/user/eventDocuments"
  );

  return {
    props: {
      data: SuperJSON.stringify({ events }),
    },
  };
};

Events.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Events;
