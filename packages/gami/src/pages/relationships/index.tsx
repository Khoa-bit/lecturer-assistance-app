import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  AllAcrossParticipantsCustomResponse,
  PeopleResponse,
  RelationshipsCustomResponse,
  RelationshipsRecord,
  RelationshipsResponse,
  StarredParticipants,
} from "raito";
import { Collections } from "raito";
import { useCallback, useMemo, useState } from "react";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface RelationshipsData {
  relationships: ListResult<mergeRelationship>;
  newRelationshipsOptions: ListResult<mergeRelationship>;
  starredParticipants: ListResult<StarredParticipants>;
  allAcrossParticipants: ListResult<AllAcrossParticipantsCustomResponse>;
  pbAuthCookie: string;
}

export type mergeRelationship = RelationshipsCustomResponse &
  RelationshipsResponse<{ toPerson: PeopleResponse }>;

function Relationships({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<RelationshipsData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const [relationships, setRelationships] = useState(
    dataParse.relationships.items
  );
  const [newRelationshipsOptions, setNewRelationshipsOptions] = useState(
    dataParse.newRelationshipsOptions.items
  );
  const [allAcrossParticipants, setAllAcrossParticipants] = useState(
    dataParse.allAcrossParticipants
  );
  const [starredParticipants, setStarredParticipants] = useState(
    dataParse.starredParticipants
  );

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

  const starredParticipantsList = useMemo(
    () =>
      starredParticipants.items.map((starredParticipant) => (
        <li key={starredParticipant.id}>
          <Link href={`/people/${encodeURIComponent(starredParticipant.id)}`}>
            {`${starredParticipant.name} - ${starredParticipant.expand.fullDocument_id_list} - ${starredParticipant.expand.eventDocument_id_list}`}
          </Link>
          <span> - </span>
          <button
            onClick={() => {
              console.log(
                `Un-star ${starredParticipant.expand.relationship_id_list}`
              );

              const relationshipId =
                starredParticipant.expand.relationship_id_list.at(0);

              if (!relationshipId) return;

              pbClient
                .collection(Collections.Relationships)
                .delete(relationshipId)
                .then(async () => {
                  const newStarredParticipants =
                    await pbClient.apiGetList<StarredParticipants>(
                      "/api/user/getStarredParticipants?fullList=true"
                    );

                  setStarredParticipants(newStarredParticipants);
                });
            }}
          >
            Remove Star
          </button>
        </li>
      )) ?? <p>{"Error when fetching full documents :<"}</p>,
    [pbClient, starredParticipants.items]
  );

  const allAcrossParticipantsList = useMemo(
    () =>
      allAcrossParticipants.items.map((allAcrossParticipant) => (
        <li key={allAcrossParticipant.id}>
          <Link href={`/people/${encodeURIComponent(allAcrossParticipant.id)}`}>
            {`${allAcrossParticipant.name} - ${allAcrossParticipant.expand.fullDocument_id_list} - ${allAcrossParticipant.expand.eventDocument_id_list}`}
          </Link>
          {/* Only show star button when it has not been starred yet */}
          {!starredParticipants.items.some(
            (starredParticipant) =>
              allAcrossParticipant.id == starredParticipant.id
          ) && (
            <>
              <span> - </span>
              <button
                onClick={() => {
                  console.log(
                    `Star ${allAcrossParticipant.expand.relationship_id_list}`
                  );

                  pbClient
                    .collection(Collections.Relationships)
                    .create<RelationshipsResponse>({
                      fromPerson: user.person,
                      toPerson: allAcrossParticipant.id,
                    } as RelationshipsRecord)
                    .then(async () => {
                      const newStarredParticipants =
                        await pbClient.apiGetList<StarredParticipants>(
                          "/api/user/getStarredParticipants?fullList=true"
                        );

                      setStarredParticipants(newStarredParticipants);
                    });
                }}
              >
                Add Star
              </button>
            </>
          )}
        </li>
      )) ?? <p>{"Error when fetching full documents :<"}</p>,
    [
      allAcrossParticipants.items,
      pbClient,
      starredParticipants.items,
      user.person,
    ]
  );

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>
      <h1>Contacts</h1>
      <h2>Starred Participants</h2>
      <ol>{starredParticipantsList}</ol>
      <h2>Participants</h2>
      <ol>{allAcrossParticipantsList}</ol>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);

  const relationships = await pbServer.apiGetList<RelationshipsCustomResponse>(
    "/api/user/relationships"
  );

  const newRelationshipsOptions =
    await pbServer.apiGetList<RelationshipsCustomResponse>(
      "/api/user/newRelationshipsOptions?fullList=true"
    );

  const starredParticipants = await pbServer.apiGetList<StarredParticipants>(
    "/api/user/getStarredParticipants?fullList=true"
  );

  const allAcrossParticipants =
    await pbServer.apiGetList<AllAcrossParticipantsCustomResponse>(
      "/api/user/allAcrossParticipants?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
        relationships,
        newRelationshipsOptions,
        starredParticipants,
        allAcrossParticipants,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as RelationshipsData),
    },
  };
};

Relationships.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Relationships;
