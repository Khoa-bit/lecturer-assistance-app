import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData extends FullDocumentData {
  pbAuthCookie: string;
}

function Document({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const fullDocument = dataParse.fullDocument;
  const upcomingEventDocuments = dataParse.upcomingEventDocuments;
  const pastEventDocuments = dataParse.pastEventDocuments;
  const allDocParticipants = dataParse.allDocParticipants;
  const permission = dataParse.permission;
  const people = dataParse.people;
  const attachments = dataParse.attachments;

  const fullDocumentProps: FullDocumentProps<never> = {
    fullDocument,
    attachments,
    upcomingEventDocuments,
    pastEventDocuments,
    allDocParticipants,
    permission,
    people,
    pbClient,
    user,
  };

  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
      <FullDocument {...fullDocumentProps}></FullDocument>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);
  const fullDocId = query.fullDocId as string;

  const fullDocumentData = await fetchFullDocumentData(
    pbServer,
    user,
    fullDocId
  );

  return {
    props: {
      data: SuperJSON.stringify({
        ...fullDocumentData,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Document.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Document;
