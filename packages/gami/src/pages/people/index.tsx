import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import type { ListResult } from "pocketbase";
import type { ContactsCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface PeopleData {
  contacts: ListResult<ContactsCustomResponse>;
}

function People({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data) {
    return <ErrorPage statusCode={404} />;
  }

  const dataParse = SuperJSON.parse<PeopleData>(data);

  const contactsList = dataParse.contacts.items.map((contact) => (
    <li key={contact.id}>
      {`${contact.name} - ${contact.expand.documents_name_list}`}
    </li>
  )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <>
      <Head>
        <title>People relationship</title>
      </Head>
      <h1>People relationship</h1>
      <ol>{contactsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const contacts = await pbServer.apiGetList<ContactsCustomResponse>(
    "/api/user/contacts"
  );

  return {
    props: {
      data: SuperJSON.stringify({ contacts }),
    },
  };
};

People.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default People;
