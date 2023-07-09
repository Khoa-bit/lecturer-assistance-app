import type { ColumnDef } from "@tanstack/react-table";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type { ListResult } from "pocketbase";
import type {
  ContactsCustomResponse,
  RelationshipsRecord,
  RelationshipsResponse,
  StarredContactsCustomResponse,
  UsersResponse,
} from "src/types/raito";
import { Collections } from "src/types/raito";
import type { SetStateAction } from "react";
import { useState } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import IndexCell from "src/components/tanstackTable/IndexCell";
import IndexHeaderCell from "src/components/tanstackTable/IndexHeaderCell";
import IndexTable from "src/components/tanstackTable/IndexTable";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import { IcRoundVerified } from "../../components/icons/IcRoundVerified";

interface RelationshipsData {
  starredContacts: ListResult<StarredContactsCustomResponse>;
  contacts: ListResult<ContactsCustomResponse>;
  pbAuthCookie: string;
}

interface NameItem {
  name: string;
  hasAccount: boolean;
}

function Relationships({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<RelationshipsData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const contacts = dataParse.contacts;
  const [starredContacts, setStarredContacts] = useState(
    dataParse.starredContacts
  );

  return (
    <main className="mx-auto flex max-w-screen-lg flex-col px-4 py-8">
      <Head>
        <title>Contacts</title>
      </Head>
      <header className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>

        <div className="invisible p-3" aria-hidden>
          Filler
        </div>
      </header>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Starred Contacts"
          initData={starredContacts}
          columns={initPeopleColumns(true, pbClient, user, setStarredContacts)}
        ></IndexTable>
      </section>
      <section className="my-4 rounded-lg bg-white px-7 py-5">
        <IndexTable
          heading="Contacts"
          initData={contacts}
          columns={initPeopleColumns(
            false,
            pbClient,
            user,
            setStarredContacts,
            starredContacts
          )}
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

  const starredContacts =
    await pbServer.apiGetList<StarredContactsCustomResponse>(
      "/api/user/getStarredContacts?fullList=true"
    );

  const contacts = await pbServer.apiGetList<ContactsCustomResponse>(
    "/api/user/getContacts?fullList=true"
  );

  return {
    props: {
      data: SuperJSON.stringify({
        starredContacts,
        contacts,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as RelationshipsData),
    },
  };
};

function initPeopleColumns(
  isStarTable: boolean,
  pbClient: PBCustom,
  user: UsersResponse,
  setStarredContacts: (
    value: SetStateAction<ListResult<StarredContactsCustomResponse>>
  ) => void,
  starredContacts?: ListResult<StarredContactsCustomResponse>
): ColumnDef<ContactsCustomResponse | StarredContactsCustomResponse>[] {
  const getHref = (lectureCourseId: string) =>
    `/people/${encodeURIComponent(lectureCourseId)}`;

  const starredContactsMap = new Map<string, StarredContactsCustomResponse>();
  if (starredContacts) {
    for (const starredContact of starredContacts.items) {
      starredContactsMap.set(starredContact.id, starredContact);
    }
  }

  const createStarButton = (
    contact: ContactsCustomResponse | StarredContactsCustomResponse
  ) => {
    // Provide remove star function for ContactsTable by looping through the starredContacts.items to find a match
    // then return <RemoveStar> button for that starredContacts
    const tryGetStarredContact = starredContactsMap.get(contact.id);
    if (!isStarTable && starredContacts && tryGetStarredContact) {
      return (
        <RemoveStar
          pbClient={pbClient}
          contact={tryGetStarredContact}
          setStarredContacts={setStarredContacts}
        ></RemoveStar>
      );
    }

    if (isStarTable && isStarredContacts(contact)) {
      return (
        <RemoveStar
          pbClient={pbClient}
          contact={contact}
          setStarredContacts={setStarredContacts}
        ></RemoveStar>
      );
    }

    return (
      <AddStar
        pbClient={pbClient}
        user={user}
        contact={contact}
        setStarredContacts={setStarredContacts}
      ></AddStar>
    );
  };

  return [
    {
      accessorFn: (item) => item,
      enableColumnFilter: false,
      id: "star",
      cell: (info) =>
        createStarButton(
          info.getValue() as
            | ContactsCustomResponse
            | StarredContactsCustomResponse
        ),
      header: () => (
        <IndexHeaderCell className="min-w-[1rem]"> </IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => {
        return {
          name: item.name,
          hasAccount: item.hasAccount,
        };
      },
      id: "name",
      cell: (info) => (
        <IndexCell
          className="min-w-[12rem]"
          href={getHref(info.row.original.id)}
        >
          <p className="flex items-center gap-1">
            {(info.getValue() as NameItem).name}
            {(info.getValue() as NameItem).hasAccount && (
              <IcRoundVerified className="h-4 w-4 text-blue-400"></IcRoundVerified>
            )}
          </p>
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[12rem]">Name</IndexHeaderCell>
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
        [item.personalEmail, item.expand?.user_email]
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
    {
      accessorFn: (item) => (item.isFaculty ? "Yes" : "No"),
      id: "isFaculty",
      cell: (info) => (
        <IndexCell
          className="min-w-[6rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[6rem]">Is Faculty</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand?.major_name,
      id: "major_name",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">Major</IndexHeaderCell>
      ),
      footer: () => null,
    },
    {
      accessorFn: (item) => item.expand?.department_name,
      id: "department_name",
      cell: (info) => (
        <IndexCell
          className="min-w-[10rem]"
          href={getHref(info.row.original.id)}
        >
          {info.getValue() as string}
        </IndexCell>
      ),
      header: () => (
        <IndexHeaderCell className="min-w-[10rem]">Department</IndexHeaderCell>
      ),
      footer: () => null,
    },
  ];
}

interface RemoveStarProps {
  pbClient: PBCustom;
  contact: StarredContactsCustomResponse;
  setStarredContacts: (
    value: SetStateAction<ListResult<StarredContactsCustomResponse>>
  ) => void;
}

export function RemoveStar({
  pbClient,
  contact,
  setStarredContacts,
}: RemoveStarProps) {
  return (
    <button
      className="w-full"
      onClick={() => {
        const relationshipId = contact.expand.relationship_id;

        if (!relationshipId) return;

        pbClient
          .collection(Collections.Relationships)
          .delete(relationshipId)
          .then(async () => {
            const newStarredContacts =
              await pbClient.apiGetList<StarredContactsCustomResponse>(
                "/api/user/getStarredContacts?fullList=true"
              );

            setStarredContacts(newStarredContacts);
          });
      }}
    >
      <span className="material-symbols-rounded text-yellow-500 [font-variation-settings:'FILL'_1] hover:text-yellow-400">
        star
      </span>
    </button>
  );
}

interface AddStarProps {
  pbClient: PBCustom;
  user: UsersResponse;
  contact: ContactsCustomResponse;
  setStarredContacts: (
    value: SetStateAction<ListResult<StarredContactsCustomResponse>>
  ) => void;
}

export function AddStar({
  pbClient,
  user,
  contact,
  setStarredContacts,
}: AddStarProps) {
  return (
    <button
      className="w-full"
      onClick={() => {
        pbClient
          .collection(Collections.Relationships)
          .create<RelationshipsResponse>({
            fromPerson: user.person,
            toPerson: contact.id,
          } as RelationshipsRecord)
          .then(async () => {
            const newStarredContacts =
              await pbClient.apiGetList<StarredContactsCustomResponse>(
                "/api/user/getStarredContacts?fullList=true"
              );

            setStarredContacts(newStarredContacts);
          });
      }}
    >
      <span className="material-symbols-rounded text-yellow-500 hover:text-yellow-400">
        star
      </span>
    </button>
  );
}

function isStarredContacts(
  contact: ContactsCustomResponse | StarredContactsCustomResponse
): contact is StarredContactsCustomResponse {
  return (
    (contact as StarredContactsCustomResponse).expand.relationship_id !==
    undefined
  );
}

Relationships.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Relationships;
