import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
  PersonalNotesRecord,
  PersonalNotesResponse,
} from "raito";
import { Collections } from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewPersonalNoteData {
  newEventDocUrl: string;
}

function NewPersonalNote({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewPersonalNoteData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newEventDocUrl);
  }, [dataParse.newEventDocUrl, router]);

  return (
    <>
      <Head>
        <title>New personal note</title>
      </Head>
      <h1>Creating your new personal note...</h1>
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

  const baseFullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .create<FullDocumentsResponse>({
      document: baseDocument.id,
      category: "Draft",
    } as FullDocumentsRecord);

  const personalNote = await pbServer
    .collection(Collections.PersonalNotes)
    .create<PersonalNotesResponse>({
      fullDocument: baseFullDocument.id,
    } as PersonalNotesRecord);

  const newPersonalNoteUrl = `/personalNotes/${personalNote.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newEventDocUrl: newPersonalNoteUrl,
      } as NewPersonalNoteData),
    },
  };
};

NewPersonalNote.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewPersonalNote;
