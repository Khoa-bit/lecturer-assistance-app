import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  AcademicMaterialsRecord,
  AcademicMaterialsResponse,
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
} from "src/types/raito";
import {
  AcademicMaterialsCategoryOptions,
  Collections,
  FullDocumentsInternalOptions,
} from "src/types/raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewAcademicMaterialData {
  newEventDocUrl: string;
}

function NewAcademicMaterial({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewAcademicMaterialData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newEventDocUrl);
  }, [dataParse.newEventDocUrl, router]);

  return (
    <>
      <Head>
        <title>New Academic Material</title>
      </Head>
      <h1>Creating your new Academic Material...</h1>
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
      internal: FullDocumentsInternalOptions["Academic material"],
    } as FullDocumentsRecord);

  const AcademicMaterial = await pbServer
    .collection(Collections.AcademicMaterials)
    .create<AcademicMaterialsResponse>({
      fullDocument: baseFullDocument.id,
      category: AcademicMaterialsCategoryOptions.Draft,
    } as AcademicMaterialsRecord);

  const newAcademicMaterialUrl = `/academicMaterials/${AcademicMaterial.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newEventDocUrl: newAcademicMaterialUrl,
      } as NewAcademicMaterialData),
    },
  };
};

NewAcademicMaterial.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewAcademicMaterial;
