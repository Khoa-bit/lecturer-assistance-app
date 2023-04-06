import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type { ListResult } from "pocketbase";
import type {
  StarredContactsCustomResponse,
  ContactsCustomResponse,
} from "raito";
import { useState } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import ContactsTable from "src/components/relationships/ContactsTable";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface RelationshipsData {
  starredContacts: ListResult<StarredContactsCustomResponse>;
  contacts: ListResult<ContactsCustomResponse>;
  pbAuthCookie: string;
}

function Relationships({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<RelationshipsData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const contacts = dataParse.contacts;
  const [starredContacts, setStarredContacts] = useState(
    dataParse.starredContacts
  );

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
      <Head>
        <title>Contacts</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Starred Contacts
        </h2>
        <ContactsTable
          isStarTable={true}
          contacts={starredContacts}
          pbClient={pbClient}
          user={user}
          setStarredContacts={setStarredContacts}
        ></ContactsTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">Contacts</h2>
        <ContactsTable
          isStarTable={false}
          contacts={contacts}
          pbClient={pbClient}
          user={user}
          starredContacts={starredContacts}
          setStarredContacts={setStarredContacts}
        ></ContactsTable>
      </section>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const starredContacts =
    await pbServer.apiGetList<StarredContactsCustomResponse>(
      "/api/user/getStarredContacts?fullList=true"
    );

  const contacts = await pbServer.apiGetList<ContactsCustomResponse>(
    "/api/user/getContacts?fullList=true"
  );

  return {
    props: {
      data: SuperJSON.stringify({
        starredContacts,
        contacts,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as RelationshipsData),
    },
  };
};

Relationships.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Relationships;
