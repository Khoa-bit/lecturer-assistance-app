import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  DocumentsResponse,
  DocumentsRecord,
  FullDocumentsResponse,
  FullDocumentsRecord,
} from "raito";
import { Collections } from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewFullDocumentData {
  newFullDocUrl: string;
}

function NewFullDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewFullDocumentData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newFullDocUrl);
  }, [dataParse.newFullDocUrl, router]);

  return (
    <>
      <Head>
        <title>New full document</title>
      </Head>
      <h1>Creating your new full document...</h1>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);

  const baseDocument = await pbServer
    .collection(Collections.Documents)
    .create<DocumentsResponse>({
      name: "Untitled",
      priority: "Medium",
      status: "Todo",
      owner: user.person,
    } as DocumentsRecord);

  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .create<FullDocumentsResponse>({
      document: baseDocument.id,
      category: "Draft",
    } as FullDocumentsRecord);

  const newFullDocUrl = `/fullDocuments/${fullDocument.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newFullDocUrl,
      } as NewFullDocumentData),
    },
  };
};

NewFullDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewFullDocument;
