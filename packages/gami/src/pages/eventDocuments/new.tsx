import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsRecord,
  EventDocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
} from "raito";
import {
  Collections,
  EventDocumentsRecurringOptions,
  FullDocumentsInternalOptions,
} from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewEventDocumentData {
  newEventDocUrl: string;
}

function NewEventDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewEventDocumentData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newEventDocUrl);
  }, [dataParse.newEventDocUrl, router]);

  return (
    <>
      <Head>
        <title>New event document</title>
      </Head>
      <h1>Creating your new event document...</h1>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);

  let toFullDocId = query.toFullDocId as string | undefined;

  // Check if the toFullDocId is valid
  if (toFullDocId) {
    try {
      await pbServer
        .collection(Collections.FullDocuments)
        .getOne<FullDocumentsResponse>(toFullDocId);
    } catch (error) {
      toFullDocId = undefined;
    }
  }

  const baseDocument = await pbServer
    .collection(Collections.Documents)
    .create<DocumentsResponse>({
      name: "Untitled",
      priority: "Medium",
      status: "Todo",
      owner: user.person,
    } as DocumentsRecord);

  const baseFullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .create<FullDocumentsResponse>({
      document: baseDocument.id,
      internal: FullDocumentsInternalOptions.Event,
    } as FullDocumentsRecord);

  const eventDocument = await pbServer
    .collection(Collections.EventDocuments)
    .create<EventDocumentsResponse>({
      fullDocument: baseFullDocument.id,
      toFullDocument: toFullDocId,
      recurring: EventDocumentsRecurringOptions.Once,
    } as EventDocumentsRecord);

  const newEventDocUrl = `/eventDocuments/${eventDocument.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newEventDocUrl,
      } as NewEventDocumentData),
    },
  };
};

NewEventDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewEventDocument;
