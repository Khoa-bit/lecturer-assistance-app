import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  PeopleResponse,
  RelationshipsCustomResponse,
  RelationshipsResponse,
} from "raito";
import { Collections } from "raito";
import { useCallback, useMemo, useState } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";
import NewContact from "../../components/contracts/NewContact";

interface RelationshipsData {
  relationships: ListResult<mergeRelationship>;
  newRelationshipsOptions: ListResult<mergeRelationship>;
  fromUser: string;
  pbAuthCookie: string;
}

export type mergeRelationship = RelationshipsCustomResponse &
  RelationshipsResponse<{ toPerson: PeopleResponse }>;

function Relationships({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<RelationshipsData>(data);
  const [relationships, setRelationships] = useState(
    dataParse.relationships.items
  );
  const [newRelationshipsOptions, setNewRelationshipsOptions] = useState(
    dataParse.newRelationshipsOptions.items
  );
  const fromUser = dataParse.fromUser;
  const { pbClient } = usePBClient(dataParse.pbAuthCookie);

  const deleteRelationship = useCallback(
    async (relationship: mergeRelationship) => {
      const relationshipId = relationship.id;
      const hasDeleted = await pbClient
        .collection(Collections.Relationships)
        .delete(relationshipId);

      if (!hasDeleted) return;

      setRelationships((relationships) =>
        relationships.filter(
          (relationship) => relationship.id != relationshipId
        )
      );

      // Push the deleted relationship back to newRelationshipsOptions list
      setNewRelationshipsOptions((relationships) => [
        ...relationships,
        relationship,
      ]);
    },
    [pbClient]
  );

  const relationshipsList = useMemo(
    () =>
      relationships.map((relationship) => (
        <li key={relationship.id}>
          <Link href={`/people/${encodeURIComponent(relationship.toPerson)}`}>
            {`${
              relationship.expand.toPerson_name ??
              relationship.expand.toPerson.name
            }`}
          </Link>
          <span> - </span>
          <button
            onClick={() => {
              deleteRelationship(relationship);
            }}
          >
            Delete
          </button>
        </li>
      )) ?? <p>{"Error when fetching full documents :<"}</p>,
    [deleteRelationship, relationships]
  );

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>
      <h1>Contacts</h1>
      <NewContact
        newRelationshipsOptions={newRelationshipsOptions}
        fromPerson={fromUser}
        pbClient={pbClient}
        setNewRelationshipsOptions={setNewRelationshipsOptions}
        setRelationships={setRelationships}
      ></NewContact>
      <ol>{relationshipsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);

  const relationships = await pbServer.apiGetList<RelationshipsCustomResponse>(
    "/api/user/relationships"
  );

  const newRelationshipsOptions =
    await pbServer.apiGetList<RelationshipsCustomResponse>(
      "/api/user/newRelationshipsOptions?fullList=true"
    );

  console.log(JSON.stringify(newRelationshipsOptions, null, 2));

  return {
    props: {
      data: SuperJSON.stringify({
        relationships,
        newRelationshipsOptions,
        fromUser: user.person,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as RelationshipsData),
    },
  };
};

Relationships.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Relationships;
