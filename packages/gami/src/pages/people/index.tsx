import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type { PeopleResponse, UsersResponse } from "raito";
import { Collections } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface PeopleData {
  people: ListResult<PeopleResponse<UsersExpand>>;
}

interface UsersExpand {
  "users(person)": UsersResponse;
}

function People({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<PeopleData>(data);

  const peopleList = dataParse.people.items.map((person) => (
    <li key={person.id}>
      <Link href={`/people/${encodeURIComponent(person.id)}`}>
        {`${person.name} - ${JSON.stringify(
          person.expand?.["users(person)"]?.email
        )}`}
      </Link>
    </li>
  )) ?? <p>{"Error when fetching full documents :<"}</p>;

  return (
    <>
      <Head>
        <title>People</title>
      </Head>
      <h1>People</h1>
      <Link className="text-blue-700 underline" href="/people/new">
        New Person (This new button should only be visible when user cannot find
        the people they are looking for)
      </Link>
      <ol>{peopleList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const people = await pbServer
    .collection(Collections.People)
    .getList<PeopleResponse<UsersExpand>>(undefined, undefined, {
      expand: "users(person)",
    });

  return {
    props: {
      data: SuperJSON.stringify({ people } as PeopleData),
    },
  };
};

People.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default People;
