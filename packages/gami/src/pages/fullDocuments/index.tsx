import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { FullDocumentsResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface FullDocumentsData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fullDocuments: ListResult<FullDocumentsResponse<any>>;
}

function FullDocuments({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data) {
    return <ErrorPage statusCode={404} />;
  }

  const dataParse = SuperJSON.parse<FullDocumentsData>(data);

  const FullDocumentsList = dataParse.fullDocuments.items.map((fullDoc) => (
    <li key={fullDoc.id}>
      <Link href={`/fullDocuments/${encodeURIComponent(fullDoc.id)}`}>
        {JSON.stringify(fullDoc.expand?.documents_name)}
      </Link>
    </li>
  )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <>
      <Head>
        <title>FullDocuments</title>
      </Head>
      <h1>FullDocuments</h1>
      <Link className="text-blue-700 underline" href="/fullDocuments/new">
        New Full document
      </Link>
      <ol>{FullDocumentsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req);

  const fullDocuments = await pbServer.apiGetList<FullDocumentsResponse>(
    "/api/user/fullDocuments"
  );

  return {
    props: {
      data: SuperJSON.stringify({ fullDocuments }),
    },
  };
};

FullDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default FullDocuments;
