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
import PeopleTable from "src/components/people/PeopleTable";
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
  const people = dataParse.people;

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
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">People</h1>

        <Link
          className="flex justify-center rounded bg-blue-500 p-3 font-bold text-white hover:bg-blue-400"
          href="/people/new"
        >
          <span className="material-symbols-rounded select-none">add</span> Add
          new person
        </Link>
      </header>
      <section className="my-4 rounded-lg bg-white py-5 px-7">
        <PeopleTable people={people}></PeopleTable>
      </section>
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
