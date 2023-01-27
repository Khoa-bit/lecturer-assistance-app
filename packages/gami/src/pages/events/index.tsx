import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import type { ListResult } from "pocketbase";
import type { EventDocumentsResponse } from "raito";
import { Collections } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface EventsData {
  events: ListResult<EventDocumentsResponse>;
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
      <ol>{eventsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const pbServer = await getPBServer(req, res);
  const events = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse>(1, 50, {
      expand: "document",
    });

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
