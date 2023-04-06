import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  ClassesRecord,
  ClassesResponse,
  DepartmentsResponse,
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
  MajorsResponse,
  PeopleRecord,
  PeopleResponse,
} from "raito";
import { FullDocumentsInternalOptions } from "raito";
import { ClassesAcademicProgramOptions, Collections } from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getCurrentCohort } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewAdviseClassData {
  newFullDocUrl: string;
}

interface ExpandMajorDepartment {
  major: MajorsResponse<ExpandDepartment>;
}

interface ExpandDepartment {
  department: DepartmentsResponse;
}

function NewAdviseClass({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewAdviseClassData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newFullDocUrl);
  }, [dataParse.newFullDocUrl, router]);

  return (
    <>
      <Head>
        <title>New advise class</title>
      </Head>
      <h1>Creating your new advise class...</h1>
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

  const baseFullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .create<FullDocumentsResponse>({
      document: baseDocument.id,
      internal: FullDocumentsInternalOptions.Class,
    } as FullDocumentsRecord);

  const person = await pbServer
    .collection(Collections.People)
    .getOne<PeopleResponse<ExpandMajorDepartment>>(user.person);

  const adviseClass = await pbServer
    .collection(Collections.Classes)
    .create<ClassesResponse>({
      fullDocument: baseFullDocument.id,
      cohort: getCurrentCohort(),
      major: person.major,
      academicProgram: ClassesAcademicProgramOptions.Undergraduate,
    } as ClassesRecord);

  if (!person.isLecturer) {
    await pbServer
      .collection(Collections.People)
      .update<PeopleResponse>(person.id, {
        isLecturer: true,
      } as PeopleRecord);
  }

  const newFullDocUrl = `/adviseClasses/${adviseClass.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newFullDocUrl,
      } as NewAdviseClassData),
    },
  };
};

NewAdviseClass.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewAdviseClass;
