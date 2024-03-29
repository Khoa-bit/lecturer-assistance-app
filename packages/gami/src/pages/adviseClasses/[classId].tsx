import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  ClassesRecord,
  ClassesResponse,
  DepartmentsResponse,
  DocumentsResponse,
  FullDocumentsResponse,
  MajorsResponse,
} from "raito";
import { ClassesTrainingSystemOptions, Collections } from "raito";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import type { InputProps } from "src/components/documents/Input";
import Input from "src/components/documents/Input";
import MajorDepartment, {
  fetchMajorDepartment,
} from "src/components/documents/MajorDepartment";
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
  adviseClass: ClassesResponse<ClassesExpand>;
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
  pbAuthCookie: string;
}

interface ClassesExpand extends FullDocumentsExpand, MajorsExpand {}

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

interface MajorsExpand {
  major: MajorsResponse<never>;
}

function ClassDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const adviseClass = dataParse.adviseClass;
  const fullDocumentData = dataParse.fullDocumentData;
  const departments = dataParse.departments;
  const majorOptions = dataParse.majorOptions;

  const childCollectionName = Collections.Classes;
  const childId = adviseClass.id;

  const fullDocumentProps: FullDocumentProps<ClassesRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    user,
    childrenDefaultValue: {
      fullDocument: adviseClass.fullDocument,
      cohort: adviseClass.cohort,
      major: adviseClass.major,
      trainingSystem: adviseClass.trainingSystem,
      classId: adviseClass.classId,
    },
  };

  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
      <FullDocument {...fullDocumentProps}>
        <Input
          {...({
            name: "classId",
            options: { required: true },
          } as InputProps<ClassesRecord>)}
        ></Input>
        <Input
          {...({
            name: "cohort",
            options: { required: true },
          } as InputProps<ClassesRecord>)}
        ></Input>
        <MajorDepartment
          name="major"
          initDepartmentId={adviseClass.expand?.major.department ?? ""}
          initMajorOptions={majorOptions}
          departments={departments}
          pbClient={pbClient}
        ></MajorDepartment>
        <Select
          {...({
            name: "trainingSystem",
            selectOptions: Object.entries(ClassesTrainingSystemOptions).map(
              ([stringValue]) => {
                return {
                  key: stringValue,
                  value: stringValue,
                  content: stringValue,
                } as SelectOption;
              }
            ),
            options: { required: true },
          } as SelectProps<ClassesRecord>)}
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
  const classId = query.classId as string;

  const adviseClass = await pbServer
    .collection(Collections.Classes)
    .getOne<ClassesResponse<ClassesExpand>>(classId, {
      expand: "fullDocument.document, major.department",
    });

  const fullDocument = adviseClass.expand?.fullDocument;
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

  const { departments, majorOptions } = await fetchMajorDepartment(
    adviseClass.expand?.major.department ?? "",
    pbServer
  );

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocumentData,
        adviseClass,
        departments,
        majorOptions,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

ClassDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default ClassDocument;
