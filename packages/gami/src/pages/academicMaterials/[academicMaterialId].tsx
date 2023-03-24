import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  AcademicMaterialsRecord,
  AcademicMaterialsResponse,
  DocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { AcademicMaterialsCategoryOptions, Collections } from "raito";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import type {
  SelectOption,
  SelectProps,
} from "src/components/documents/Select";
import Select from "src/components/documents/Select";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocumentData: FullDocumentData;
  academicMaterial: AcademicMaterialsResponse<FullDocumentsExpand>;
  pbAuthCookie: string;
}

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

function AcademicMaterial({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const academicMaterial = dataParse.academicMaterial;
  const fullDocumentData = dataParse.fullDocumentData;

  const childCollectionName = Collections.AcademicMaterials;
  const childId = academicMaterial.id;

  const fullDocumentProps: FullDocumentProps<AcademicMaterialsRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    user,
    childrenDefaultValue: {
      fullDocument: academicMaterial.fullDocument,
      category: academicMaterial.category,
    },
  };

  return (
    <>
      <Head>
        <title>Personal notes</title>
      </Head>
      <h1>Personal notes</h1>
      <FullDocument {...fullDocumentProps}>
        <Select
          {...({
            name: "category",
            selectOptions: Object.entries(AcademicMaterialsCategoryOptions).map(
              ([stringValue]) => {
                return {
                  key: stringValue,
                  value: stringValue,
                  content: stringValue,
                } as SelectOption;
              }
            ),
            options: { required: true },
          } as SelectProps<AcademicMaterialsRecord>)}
        ></Select>
      </FullDocument>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);
  const academicMaterialId = query.academicMaterialId as string;

  const academicMaterial = await pbServer
    .collection(Collections.AcademicMaterials)
    .getOne<AcademicMaterialsResponse<FullDocumentsExpand>>(
      academicMaterialId,
      {
        expand: "fullDocument.document",
      }
    );

  const fullDocument = academicMaterial.expand?.fullDocument;
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
        academicMaterial,
        fullDocumentData,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

AcademicMaterial.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AcademicMaterial;
