import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import type { PeopleRecord, PeopleResponse } from "raito";
import { Collections } from "raito";
import { useEffect } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface NewPersonData {
  newPersonUrl: string;
}

function NewPerson({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<NewPersonData>(data);
  const router = useRouter();

  useEffect(() => {
    router.replace(dataParse.newPersonUrl);
  }, [dataParse.newPersonUrl, router]);

  return (
    <>
      <Head>
        <title>New person</title>
      </Head>
      <h1>Creating your new person...</h1>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const person = await pbServer
    .collection(Collections.People)
    .create<PeopleResponse>({} as PeopleRecord);

  const newPersonUrl = `/people/${person.id}`;

  return {
    props: {
      data: SuperJSON.stringify({
        newPersonUrl,
      } as NewPersonData),
    },
  };
};

NewPerson.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewPerson;
