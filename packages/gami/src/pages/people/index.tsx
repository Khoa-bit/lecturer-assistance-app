import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  PeopleResponse,
  UsersResponse
} from "raito";
import { Collections } from "raito";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
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

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
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
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="My personal notes"
          initData={people}
          columns={initPeopleColumns()}
        ></IndexTable>
      </section>
    </main>
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

function initPeopleColumns(): ColumnDef<PeopleResponse<UsersExpand>>[] {
  const getHref = (lectureCourseId: string) =>
    `/people/${encodeURIComponent(lectureCourseId)}`;

  return [
    {
      accessorFn: (item) => item.name,
      id: "name",
      cell: (info) => (
        <IndexCell
          className="min-w-[20rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[20rem]">Name</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.personId,
      id: "personId",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">ID</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.title,
      id: "title",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">Position</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) =>
        [item.personalEmail, item.expand?.["users(person)"]?.email]
          .filter((email) => email != undefined && email != "")
          .join(", "),
      id: "email",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">Email</IndexHeaderCell>
      ),
      footer: () => null,
    },
  ];
}

People.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default People;
