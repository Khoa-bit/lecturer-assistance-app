import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type {
  CoursesRecord,
  CoursesResponse,
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
  PeopleRecord,
  PeopleResponse,
} from "raito";
import { FullDocumentsInternalOptions } from "raito";
import { Collections } from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getCurrentSemester } from "src/lib/input_handling";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewLectureCourseData {
  newEventDocUrl: string;
}

function NewLectureCourse({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewLectureCourseData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newEventDocUrl);
  }, [dataParse.newEventDocUrl, router]);

  return (
    <>
      <Head>
        <title>New lecture course</title>
      </Head>
      <h1>Creating your new lecture course...</h1>
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
      internal: FullDocumentsInternalOptions.Course,
    } as FullDocumentsRecord);

  const person = await pbServer
    .collection(Collections.People)
    .getOne<PeopleResponse>(user.person);

  const lectureCourse = await pbServer
    .collection(Collections.Courses)
    .create<CoursesResponse>({
      fullDocument: baseFullDocument.id,
      courseTemplate: undefined,
      semester: getCurrentSemester(),
    } as CoursesRecord);

  if (!person.isAdvisor) {
    await pbServer
      .collection(Collections.People)
      .update<PeopleResponse>(person.id, {
        isAdvisor: true,
      } as PeopleRecord);
  }

  const newEventDocUrl = `/lectureCourses/${lectureCourse.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newEventDocUrl,
      } as NewLectureCourseData),
    },
  };
};

NewLectureCourse.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewLectureCourse;
