import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { PersonalNotesCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import PersonalNotesTable from "src/components/personalNotes/NotesTable";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface PersonalNotesData {
  personalNotes: ListResult<PersonalNotesCustomResponse>;
  participatedPersonalNotes: ListResult<PersonalNotesCustomResponse>;
}

function PersonalNotes({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<PersonalNotesData>(data);
  const personalNotes = dataParse.personalNotes;
  const participatedPersonalNotes = dataParse.participatedPersonalNotes;

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col py-8 px-4">
      <Head>
        <title>Personal Notes</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Personal notes</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/personalNotes/new"
        >
          <span className="material-symbols-rounded select-none">add</span> New
          personal note
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          My personal notes
        </h2>
        <PersonalNotesTable personalNotes={personalNotes}></PersonalNotesTable>
      </section>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <h2 className="pb-5 text-xl font-semibold text-gray-700">
          Participate personal notes
        </h2>
        <PersonalNotesTable
          personalNotes={participatedPersonalNotes}
        ></PersonalNotesTable>
      </section>
    </main>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const personalNotes = await pbServer.apiGetList<PersonalNotesCustomResponse>(
    "/api/user/personalNotes"
  );

  const participatedPersonalNotes =
    await pbServer.apiGetList<PersonalNotesCustomResponse>(
      "/api/user/participatedPersonalNotes?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        personalNotes,
        participatedPersonalNotes,
      } as PersonalNotesData),
    },
  };
};

PersonalNotes.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default PersonalNotes;
