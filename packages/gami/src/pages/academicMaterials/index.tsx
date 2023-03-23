import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { AcademicMaterialsCustomResponse } from "raito";
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

  const academicMaterialsList = dataParse.academicMaterials.items.map(
    (academicMaterial) => (
      <li key={academicMaterial.id}>
        <Link
          href={`/academicMaterials/${encodeURIComponent(academicMaterial.id)}`}
        >
          {JSON.stringify(academicMaterial.expand.userDocument_name)}
        </Link>
      </li>
    )
  ) ?? <p>{"Error when fetching academicMaterialsList :<"}</p>;

  const participatedAcademicMaterialsList =
    dataParse.participatedAcademicMaterials.items.map((academicMaterial) => (
      <li key={academicMaterial.id}>
        <Link
          href={`/academicMaterials/${encodeURIComponent(academicMaterial.id)}`}
        >
          {JSON.stringify(academicMaterial.expand.userDocument_name)}
        </Link>
      </li>
    )) ?? <p>{"Error when fetching participatedAcademicMaterialsList :<"}</p>;

  return (
    <>
      <Head>
        <title>Academic materials</title>
      </Head>
      <h1>Academic materials</h1>
      <Link className="text-blue-700 underline" href="/academicMaterials/new">
        New Academic material
      </Link>
      <ol>{academicMaterialsList}</ol>
      <h1>Participated Academic materials</h1>
      <ol>{participatedAcademicMaterialsList}</ol>
    </>
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
