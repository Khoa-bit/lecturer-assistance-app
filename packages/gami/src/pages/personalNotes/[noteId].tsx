import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  DocumentsResponse,
  FullDocumentsResponse,
  PersonalNotesRecord,
  PersonalNotesResponse,
} from "raito";
import { Collections } from "raito";
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

interface DocumentData {
  fullDocumentData: FullDocumentData;
  personalNote: PersonalNotesResponse<FullDocumentsExpand>;
  pbAuthCookie: string;
}

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

function PersonalNotes({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);
  const fullDocumentData = dataParse.fullDocumentData;
  const personalNote = dataParse.personalNote;

  const childCollectionName = Collections.PersonalNotes;
  const childId = personalNote.id;

  const fullDocumentProps: FullDocumentProps<PersonalNotesRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    childrenDefaultValue: {
      fullDocument: personalNote.fullDocument,
    },
  };

  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col items-center px-4">
      <Head>
        <title>Personal notes</title>
      </Head>
      <FullDocument {...fullDocumentProps}></FullDocument>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);
  const noteId = query.noteId as string;

  const personalNote = await pbServer
    .collection(Collections.PersonalNotes)
    .getOne<PersonalNotesResponse<FullDocumentsExpand>>(noteId, {
      expand: "fullDocument.document",
    });

  const fullDocument = personalNote.expand?.fullDocument;
  const fullDocId = fullDocument?.id;

  if (!fullDocId) {
    return {
      redirect: {
        destination: "/notFound",
        permanent: false,
      },
    };
  }

  const fullDocumentData = await fetchFullDocumentData(
    pbServer,
    user,
    fullDocId
  );

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocumentData,
        personalNote,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

PersonalNotes.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PersonalNotes;
