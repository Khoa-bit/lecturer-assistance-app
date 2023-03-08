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
  FullDocumentsResponse,
} from "raito";
import { Collections, EventDocumentsRecurringOptions } from "raito";
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

  let fullDocId = query.fullDocId as string | undefined;

  // Check if the fullDocId is valid
  if (fullDocId) {
    try {
      await pbServer
        .collection(Collections.FullDocuments)
        .getOne<FullDocumentsResponse>(fullDocId);
    } catch (error) {
      fullDocId = undefined;
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

  const eventDocument = await pbServer
    .collection(Collections.EventDocuments)
    .create<EventDocumentsResponse>({
      document: baseDocument.id,
      fullDocument: fullDocId,
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
