import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { AcademicMaterialsCustomResponse } from "raito";
import AcademicMaterialsTable from "src/components/academicMaterials/AcademicMaterialsTable";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface AcademicMaterialsData {
  academicMaterials: ListResult<AcademicMaterialsCustomResponse>;
  participatedAcademicMaterials: ListResult<AcademicMaterialsCustomResponse>;
}

function AcademicMaterials({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<AcademicMaterialsData>(data);
  const academicMaterials = dataParse.academicMaterials;
  const participatedAcademicMaterials = dataParse.participatedAcademicMaterials;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
      <Head>
        <title>Academic materials</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Academic materials</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/academicMaterials/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          academic materials
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          My academic materials
        </h2>
        <AcademicMaterialsTable
          academicMaterials={academicMaterials}
        ></AcademicMaterialsTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Participate academic materials
        </h2>
        <AcademicMaterialsTable
          academicMaterials={participatedAcademicMaterials}
        ></AcademicMaterialsTable>
      </section>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const academicMaterials =
    await pbServer.apiGetList<AcademicMaterialsCustomResponse>(
      "/api/user/academicMaterials"
    );

  const participatedAcademicMaterials =
    await pbServer.apiGetList<AcademicMaterialsCustomResponse>(
      "/api/user/participatedAcademicMaterials?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        academicMaterials,
        participatedAcademicMaterials,
      } as AcademicMaterialsData),
    },
  };
};

AcademicMaterials.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default AcademicMaterials;
