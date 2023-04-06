import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { ClassesCustomResponse } from "raito";
import AdviseClassesTable from "src/components/adviseClasses/ClassTable";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface AdviseClassesData {
  adviseClasses: ListResult<ClassesCustomResponse>;
  participatedAdviseClasses: ListResult<ClassesCustomResponse>;
}

function AdviseClasses({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<AdviseClassesData>(data);
  const adviseClasses = dataParse.adviseClasses;
  const participatedAdviseClasses = dataParse.participatedAdviseClasses;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
      <Head>
        <title>Advise Classes</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Advise classes</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/adviseClasses/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          advise class
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          My advise classes
        </h2>
        <AdviseClassesTable adviseClasses={adviseClasses}></AdviseClassesTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Participate advise classes
        </h2>
        <AdviseClassesTable
          adviseClasses={participatedAdviseClasses}
        ></AdviseClassesTable>
      </section>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const adviseClasses = await pbServer.apiGetList<ClassesCustomResponse>(
    "/api/user/getClasses"
  );

  const participatedAdviseClasses =
    await pbServer.apiGetList<ClassesCustomResponse>(
      "/api/user/getParticipatedClasses?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        adviseClasses,
        participatedAdviseClasses,
      } as AdviseClassesData),
    },
  };
};

AdviseClasses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AdviseClasses;
