import { type NextPage } from "next";
import type { DocumentsRecord } from "raito";
import { useAuthContext } from "src/lib/auth_client";
import { trpc } from "src/utils/trpc";

const Events: NextPage = () => {
  const { data, status } = trpc.eventDocument.getEvents.useQuery();

  const eventsList = data?.items.map((eventDoc) => (
    <li key={eventDoc.id}>
      {JSON.stringify((eventDoc.expand?.document as DocumentsRecord).name)}
    </li>
  )) ?? <p>{"Error when fetching event documents :<"}</p>;

  return (
    <>
      <h1>Events</h1>
      <p>{status}</p>
      <ol>{eventsList}</ol>
    </>
  );
};

export default Events;
