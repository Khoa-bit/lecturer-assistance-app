import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  ParticipantsCustomResponse,
  RelationshipsRecord,
  RelationshipsResponse,
} from "raito";
import { Collections } from "raito";
import { useMemo, useState } from "react";
import ParticipateDetailList from "src/components/documents/ParticipateDetailList";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface RelationshipsData {
  starredParticipants: ListResult<ParticipantsCustomResponse>;
  allAcrossParticipants: ListResult<ParticipantsCustomResponse>;
  pbAuthCookie: string;
}

function Relationships({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<RelationshipsData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const allAcrossParticipants = dataParse.allAcrossParticipants;
  const [starredParticipants, setStarredParticipants] = useState(
    dataParse.starredParticipants
  );

  const starredParticipantsList = useMemo(
    () =>
      starredParticipants.items.map((starredParticipant) => (
        <li key={starredParticipant.id}>
          <Link href={`/people/${encodeURIComponent(starredParticipant.id)}`}>
            {`${starredParticipant.name}`}
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
                    await pbClient.apiGetList<ParticipantsCustomResponse>(
                      "/api/user/getStarredParticipants?fullList=true"
                    );

                  setStarredParticipants(newStarredParticipants);
                });
            }}
          >
            Remove Star
          </button>
          <ParticipateDetailList
            participant={starredParticipant}
          ></ParticipateDetailList>
        </li>
      )) ?? <p>{"Error when fetching full documents :<"}</p>,
    [pbClient, starredParticipants.items]
  );

  const allAcrossParticipantsList = useMemo(
    () =>
      allAcrossParticipants.items.map((allAcrossParticipant) => (
        <li key={allAcrossParticipant.id}>
          <Link href={`/people/${encodeURIComponent(allAcrossParticipant.id)}`}>
            {`${allAcrossParticipant.name}`}
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
                        await pbClient.apiGetList<ParticipantsCustomResponse>(
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
          <ParticipateDetailList
            participant={allAcrossParticipant}
          ></ParticipateDetailList>
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

  const starredParticipants =
    await pbServer.apiGetList<ParticipantsCustomResponse>(
      "/api/user/getStarredParticipants?fullList=true"
    );

  const allAcrossParticipants =
    await pbServer.apiGetList<ParticipantsCustomResponse>(
      "/api/user/allAcrossParticipants?fullList=true"
    );

  return {
    props: {
      data: SuperJSON.stringify({
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
