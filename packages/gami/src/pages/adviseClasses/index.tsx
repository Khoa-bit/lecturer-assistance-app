import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { ClassesCustomResponse } from "raito";
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

  const adviseClassesList = dataParse.adviseClasses.items.map((adviseClass) => (
    <li key={adviseClass.id}>
      <Link href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}>
        {JSON.stringify(adviseClass.expand.userDocument_name)}
      </Link>
    </li>
  )) ?? <p>{"Error when fetching adviseClassesList :<"}</p>;

  const participatedAdviseClassesList =
    dataParse.participatedAdviseClasses.items.map((adviseClass) => (
      <li key={adviseClass.id}>
        <Link href={`/adviseClasses/${encodeURIComponent(adviseClass.id)}`}>
          {JSON.stringify(adviseClass.expand.userDocument_name)}
        </Link>
      </li>
    )) ?? <p>{"Error when fetching participatedAdviseClassesList :<"}</p>;

  return (
    <>
      <Head>
        <title>AdviseClasses</title>
      </Head>
      <h1>AdviseClasses</h1>
      <Link className="text-blue-700 underline" href="/adviseClasses/new">
        New Advise Class
      </Link>
      <ol>{adviseClassesList}</ol>
      <h1>Participated AdviseClasses</h1>
      <ol>{participatedAdviseClassesList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const adviseClasses = await pbServer.apiGetList<ClassesCustomResponse>(
    "/api/user/classes"
  );

  const participatedAdviseClasses =
    await pbServer.apiGetList<ClassesCustomResponse>(
      "/api/user/participatedClasses?fullList=true"
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
