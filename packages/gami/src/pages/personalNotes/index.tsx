import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { PersonalNotesCustomResponse } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
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

  const personalNotesList = dataParse.personalNotes.items.map(
    (personalNote) => (
      <li key={personalNote.id}>
        <Link href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}>
          {JSON.stringify(personalNote.expand.userDocument_name)}
        </Link>
      </li>
    )
  ) ?? <p>{"Error when fetching personalNotesList :<"}</p>;

  const participatedPersonalNotesList =
    dataParse.participatedPersonalNotes.items.map((personalNote) => (
      <li key={personalNote.id}>
        <Link href={`/personalNotes/${encodeURIComponent(personalNote.id)}`}>
          {JSON.stringify(personalNote.expand.userDocument_name)}
        </Link>
      </li>
    )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <>
      <Head>
        <title>Personal Notes</title>
      </Head>
      <h1>Personal Notes</h1>
      <Link className="text-blue-700 underline" href="/personalNotes/new">
        New Personal Note
      </Link>
      <ol>{personalNotesList}</ol>
      <h1>Participated Personal Notes</h1>
      <ol>{participatedPersonalNotesList}</ol>
    </>
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
