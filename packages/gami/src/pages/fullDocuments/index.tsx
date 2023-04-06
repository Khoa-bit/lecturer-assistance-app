import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { FullDocumentsCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface FullDocumentsData {
  fullDocuments: ListResult<FullDocumentsCustomResponse>;
  participatedFullDocuments: ListResult<FullDocumentsCustomResponse>;
}

function FullDocuments({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<FullDocumentsData>(data);

  const fullDocumentsList = dataParse.fullDocuments.items.map((fullDoc) => (
    <li key={fullDoc.id}>
      <Link href={`/fullDocuments/${encodeURIComponent(fullDoc.id)}`}>
        {`${fullDoc.expand.userDocument_name} - ${fullDoc.internal}`}
      </Link>
    </li>
  )) ?? <p>{"Error when fetching full documents :<"}</p>;

  const participatedFullDocumentsList =
    dataParse.participatedFullDocuments.items.map((fullDoc) => (
      <li key={fullDoc.id}>
        <Link href={`/fullDocuments/${encodeURIComponent(fullDoc.id)}`}>
          {`${fullDoc.expand.userDocument_name} - ${fullDoc.internal}`}
        </Link>
      </li>
    )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
      <Head>
        <title>Full documents</title>
      </Head>
      <h1>FullDocuments</h1>
      <Link className="text-blue-700 underline" href="/fullDocuments/new">
        New Full document
      </Link>
      <ol>{fullDocumentsList}</ol>
      <h1>Participated FullDocuments</h1>
      <ol>{participatedFullDocumentsList}</ol>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const fullDocuments = await pbServer.apiGetList<FullDocumentsCustomResponse>(
    "/api/user/fullDocuments"
  );

  const participatedFullDocuments =
    await pbServer.apiGetList<FullDocumentsCustomResponse>(
      "/api/user/participatedFullDocuments?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocuments,
        participatedFullDocuments,
      } as FullDocumentsData),
    },
  };
};

FullDocuments.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default FullDocuments;
