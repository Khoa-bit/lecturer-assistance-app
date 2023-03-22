import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  CoursesRecord,
  CoursesResponse,
  DocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections } from "raito";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import type { InputProps } from "src/components/documents/Input";
import Input from "src/components/documents/Input";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import type { RichText } from "src/types/documents";
import SuperJSON from "superjson";

interface DocumentData extends FullDocumentData {
  course: CoursesResponse<FullDocumentsExpand>;
  pbAuthCookie: string;
}

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse<RichText>;
}

function CourseDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const course = dataParse.course;
  const fullDocument = dataParse.fullDocument;
  const upcomingEventDocuments = dataParse.upcomingEventDocuments;
  const pastEventDocuments = dataParse.pastEventDocuments;
  const allDocParticipants = dataParse.allDocParticipants;
  const permission = dataParse.permission;
  const people = dataParse.people;
  const attachments = dataParse.attachments;

  const onSubmit = async (inputData: CoursesRecord) => {
    return await pbClient
      .collection(Collections.Courses)
      .update<CoursesResponse>(course.id, {
        fullDocument: fullDocument.id,
        semester: inputData.semester,
        courseTemplate: undefined,
      } as CoursesRecord);
  };

  const fullDocumentProps: FullDocumentProps<CoursesRecord> = {
    fullDocument,
    attachments,
    upcomingEventDocuments,
    pastEventDocuments,
    allDocParticipants,
    permission,
    people,
    pbClient,
    user,
    childInputOnSubmit: onSubmit,
    childrenDefaultValue: {
      fullDocument: fullDocument.id,
      semester: course.semester,
      courseTemplate: undefined,
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
            name: "semester",
            options: { required: true },
          } as InputProps<CoursesRecord>)}
        ></Input>
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
  const courseId = query.courseId as string;

  const course = await pbServer
    .collection(Collections.Courses)
    .getOne<CoursesResponse<FullDocumentsExpand>>(courseId, {
      expand: "fullDocument.document",
    });

  const fullDocument = course.expand?.fullDocument;
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
        ...fullDocumentData,
        course,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

CourseDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default CourseDocument;
