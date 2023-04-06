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
import { ClassesAcademicProgramOptions, Collections } from "raito";
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

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);
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
    childrenDefaultValue: {
      fullDocument: adviseClass.fullDocument,
      cohort: adviseClass.cohort,
      major: adviseClass.major,
      academicProgram: adviseClass.academicProgram,
      classId: adviseClass.classId,
    },
  };

  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col items-center px-4">
      <Head>
        <title>Advise classes</title>
      </Head>
      <FullDocument {...fullDocumentProps}>
        <Input
          {...({
            name: "classId",
            id: "classId",
            label: "Class ID",
            options: { required: true },
          } as InputProps<ClassesRecord>)}
        ></Input>
        <Input
          {...({
            name: "cohort",
            id: "cohort",
            label: "Cohort",
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
            name: "academicProgram",
            id: "academicProgram",
            label: "Academic program",
            selectOptions: Object.entries(ClassesAcademicProgramOptions).map(
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
    </main>
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
