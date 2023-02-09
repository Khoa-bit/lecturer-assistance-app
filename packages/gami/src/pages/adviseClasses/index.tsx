import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { AdvisorsResponse, ClassesResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface AdviseClassesData {
  adviseClasses: ListResult<ClassesResponse>;
}

function AdviseClasses({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data) {
    return <ErrorPage statusCode={404} />;
  }

  const dataParse = SuperJSON.parse<AdviseClassesData>(data);

  const AdviseClassesList = dataParse.adviseClasses.items.map((classDoc) => (
    <li key={classDoc.id}>{JSON.stringify(classDoc.expand?.document.name)}</li>
  )) ?? <p>{"Error when fetching class documents :<"}</p>;

  return (
    <>
      <Head>
        <title>AdviseClasses</title>
      </Head>
      <h1>AdviseClasses</h1>
      <Link className="text-blue-700 underline" href="/adviseClasses/new">
        New class
      </Link>
      <ol>{AdviseClassesList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, res);
  const adviseClasses = await pbServer.apiGetList<AdvisorsResponse>(
    "/api/user/classes"
  );

  return {
    props: {
      data: SuperJSON.stringify({ adviseClasses }),
    },
  };
};

AdviseClasses.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AdviseClasses;
