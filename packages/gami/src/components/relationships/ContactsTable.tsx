import Link from "next/link";
import type { ListResult } from "pocketbase";
import {
  Collections,
  ParticipantsCustomResponse,
  RelationshipsRecord,
  RelationshipsResponse,
  UsersResponse,
} from "raito";
import { MouseEvent, SetStateAction, useCallback } from "react";
import { PBCustom } from "src/types/pb-custom";

interface ContactsTableProps {
  participants: ListResult<ParticipantsCustomResponse>;
  isStarTable: boolean;
  pbClient: PBCustom;
  user: UsersResponse;
  starredParticipants?: ListResult<ParticipantsCustomResponse>;
  setStarredParticipants: (
    value: SetStateAction<ListResult<ParticipantsCustomResponse>>
  ) => void;
}

function ContactsTable({
  participants,
  isStarTable,
  pbClient,
  user,
  starredParticipants,
  setStarredParticipants,
}: ContactsTableProps) {
  const createStarButton = useCallback(
    (participant: ParticipantsCustomResponse) => {
      // Provide remove star function for Participant table by looping through the starredParticipants.items to find a match
      // then return <RemoveStar> button for that starredParticipant
      if (!isStarTable && starredParticipants) {
        for (const starredParticipant of starredParticipants.items) {
          if (participant.id != starredParticipant.id) continue;

          return (
            <RemoveStar
              pbClient={pbClient}
              participant={starredParticipant}
              setStarredParticipants={setStarredParticipants}
            ></RemoveStar>
          );
        }
      }

      let StarButton: JSX.Element;

      if (isStarTable) {
        StarButton = (
          <RemoveStar
            pbClient={pbClient}
            participant={participant}
            setStarredParticipants={setStarredParticipants}
          ></RemoveStar>
        );
      } else {
        StarButton = (
          <AddStar
            pbClient={pbClient}
            user={user}
            participant={participant}
            setStarredParticipants={setStarredParticipants}
          ></AddStar>
        );
      }

      return StarButton;
    },
    [isStarTable, pbClient, setStarredParticipants, starredParticipants, user]
  );

  const contactsList = participants.items.map((person, index) => (
    <tr
      key={person.id}
      className="grid grid-cols-[3rem_2rem_2fr_1fr_1fr_1fr_2rem] rounded px-3 py-2 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>{createStarButton(person)}</td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.name}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.personId}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.title}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {[person.personalEmail, person.expand.user_email_list[0]]
            .filter((email) => email != undefined && email != "")
            .join(", ")}
        </Link>
      </td>
      <td>
        <Link
          className="group inline-block h-full w-full"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          <span className="material-symbols-rounded">chevron_right</span>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div className="overflow-x-auto">
      <table className="table w-full whitespace-nowrap">
        <thead className="border-b text-left">
          <tr className="grid grid-cols-[3rem_2rem_2fr_1fr_1fr_1fr_2rem] p-3">
            <th className="!static">No.</th>
            <th></th>
            <th>Name</th>
            <th>ID</th>
            <th>Position</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{contactsList}</tbody>
      </table>
    </div>
  );
}

interface RemoveStarProps {
  pbClient: PBCustom;
  participant: ParticipantsCustomResponse;
  setStarredParticipants: (
    value: SetStateAction<ListResult<ParticipantsCustomResponse>>
  ) => void;
}

export function RemoveStar({
  pbClient,
  participant,
  setStarredParticipants,
}: RemoveStarProps) {
  return (
    <button
      onClick={() => {
        console.log(`Un-star ${participant.expand.relationship_id_list}`);

        const relationshipId = participant.expand.relationship_id_list.at(0);

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
      <style></style>
      <span className="material-symbols-rounded align-top text-yellow-500 [font-variation-settings:'FILL'_1] hover:text-yellow-400">
        star
      </span>
    </button>
  );
}

interface AddStarProps {
  pbClient: PBCustom;
  user: UsersResponse;
  participant: ParticipantsCustomResponse;
  setStarredParticipants: (
    value: SetStateAction<ListResult<ParticipantsCustomResponse>>
  ) => void;
}

export function AddStar({
  pbClient,
  user,
  participant,
  setStarredParticipants,
}: AddStarProps) {
  return (
    <button
      onClick={() => {
        console.log(`Star ${participant.expand.relationship_id_list}`);

        pbClient
          .collection(Collections.Relationships)
          .create<RelationshipsResponse>({
            fromPerson: user.person,
            toPerson: participant.id,
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
      <span className="material-symbols-rounded align-top text-yellow-500 hover:text-yellow-400">
        star
      </span>
    </button>
  );
}

export default ContactsTable;
