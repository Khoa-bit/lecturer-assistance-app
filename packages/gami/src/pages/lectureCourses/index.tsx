import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { CoursesCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface LectureCoursesData {
  lectureCourses: ListResult<CoursesCustomResponse>;
  participatedLectureCourses: ListResult<CoursesCustomResponse>;
}

function LectureCourses({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<LectureCoursesData>(data);

  const lectureCoursesList = dataParse.lectureCourses.items.map(
    (lectureCourse) => (
      <li key={lectureCourse.id}>
        <Link href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}>
          {JSON.stringify(lectureCourse.expand.userDocument_name)}
        </Link>
      </li>
    )
  ) ?? <p>{"Error when fetching lectureCoursesList :<"}</p>;

  const participatedLectureCoursesList =
    dataParse.participatedLectureCourses.items.map((lectureCourse) => (
      <li key={lectureCourse.id}>
        <Link href={`/lectureCourses/${encodeURIComponent(lectureCourse.id)}`}>
          {JSON.stringify(lectureCourse.expand.userDocument_name)}
        </Link>
      </li>
    )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <>
      <Head>
        <title>LectureCourses</title>
      </Head>
      <h1>LectureCourses</h1>
      <Link className="text-blue-700 underline" href="/lectureCourses/new">
        New Lecture Course
      </Link>
      <ol>{lectureCoursesList}</ol>
      <h1>Participated LectureCourses</h1>
      <ol>{participatedLectureCoursesList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const lectureCourses = await pbServer.apiGetList<CoursesCustomResponse>(
    "/api/user/courses"
  );

  const participatedLectureCourses =
    await pbServer.apiGetList<CoursesCustomResponse>(
      "/api/user/participatedCourses?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        lectureCourses,
        participatedLectureCourses,
      } as LectureCoursesData),
    },
  };
};

LectureCourses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default LectureCourses;
