import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { CoursesCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import CoursesTable from "src/components/lectureCourses/CourseTable";
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
  const lectureCourses = dataParse.lectureCourses;
  const participatedLectureCourses = dataParse.participatedLectureCourses;

  return (
    <>
      <Head>
        <title>LectureCourses</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Lecture courses</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/lectureCourses/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          lecture course
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          My lecture courses
        </h2>
        <CoursesTable lectureCourses={lectureCourses}></CoursesTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Participate lecture courses
        </h2>
        <CoursesTable
          lectureCourses={participatedLectureCourses}
        ></CoursesTable>
      </section>
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

  console.log(
    JSON.stringify(lectureCourses, null, 2),
    JSON.stringify(participatedLectureCourses, null, 2)
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
