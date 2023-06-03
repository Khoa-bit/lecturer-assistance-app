import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  ParticipantsCustomResponse,
  ParticipantsRecord,
  ParticipantsResponse,
  PeopleResponse,
  UsersResponse,
} from "raito";
import {
  Collections,
  ParticipantsPermissionOptions,
  ParticipantsStatusOptions,
} from "raito";
import React, { useCallback, useMemo, useState } from "react";
import type { PBCustom } from "src/types/pb-custom";
import account_circle_black from "../../../public/account_circle_black.png";
import ImageFallback from "../ImageFallback";
import type { Education, Experience, Interests } from "../../types/peopleJSON";
import type {
  InvitationRequestBody,
  InvitationResponse,
} from "../../pages/api/email/invitation";
import SuperJSON from "superjson";
import { tryGetFirstValidEmail } from "../../lib/input_handling";
import { ParticipationStatus } from "./ParticipationStatus";
import { ImportParticipantsInput } from "./ImportParticipantsInput";

interface PeopleExpand {
  person: PeopleResponse;
}

interface NewParticipantFormProps {
  docId: string;
  people: PeopleResponse<Education, Experience, Interests, unknown>[];
  owner: PeopleResponse;
  user: UsersResponse<PeopleExpand>;
  defaultValue: ListResult<ParticipantsCustomResponse>;
  pbClient: PBCustom;
  disabled: boolean;
}

// 15-seconds delay for form modification :3
const emailInvitationDelay = 15000;

function ParticipantsList({
  docId,
  people,
  owner,
  user,
  defaultValue,
  pbClient,
  disabled,
}: NewParticipantFormProps) {
  const [allDocParticipants, setAllDocParticipants] = useState(defaultValue);

  const newPeopleOptions = useMemo(
    () =>
      people
        .filter(
          (person) =>
            !allDocParticipants.items.some(
              (allDocParticipant) => allDocParticipant.id == person.id
            ) && user.person != person.id
        )
        .sort((a, b) =>
          getParticipantOptionName(a).localeCompare(getParticipantOptionName(b))
        ),
    [allDocParticipants.items, people, user.person]
  );

  const sendInvitation = useCallback(
    async (allDocParticipant: ParticipantsCustomResponse) => {
      const requestBody: InvitationRequestBody = {
        docId,
        participant: allDocParticipant,
      };

      const invitationResponse = await fetch(
        `/api/email/invitation?toEmail=${tryGetFirstValidEmail([
          allDocParticipant.personalEmail,
          allDocParticipant.expand.user_email,
        ])}`,
        { method: "POST", body: SuperJSON.stringify(requestBody) }
      )
        .then((res) => {
          return res.json() as Promise<InvitationResponse>;
        })
        .catch((err: Error) => {
          throw err;
        });

      return invitationResponse;
    },
    [docId]
  );

  const userParticipation = allDocParticipants.items.find(
    (allDocParticipant) => allDocParticipant.id === user.person
  );
  const [userParticipationStatus, setUserParticipationStatus] = useState(
    userParticipation?.expand.participant_status
  );

  const participantsList = useMemo(
    () =>
      allDocParticipants.items.map((allDocParticipant) => {
        let status = allDocParticipant.expand.participant_status as
          | ParticipantsStatusOptions
          | undefined;
        if (allDocParticipant.id === user.person) {
          status = userParticipationStatus as
            | ParticipantsStatusOptions
            | undefined;
        }

        return (
          <li
            key={allDocParticipant.id}
            className="flex w-full items-center justify-center gap-2 rounded p-2 hover:bg-gray-50"
          >
            <Link
              className="flex grow items-center gap-1"
              href={`/people/${encodeURIComponent(allDocParticipant.id)}`}
            >
              <div className="relative min-h-fit min-w-fit">
                <ImageFallback
                  className="mr-2 h-9 w-9 rounded-full"
                  src={pbClient.buildUrl(
                    `api/files/people/${allDocParticipant.id}/${allDocParticipant.avatar}?thumb=36x36`
                  )}
                  fallbackSrc={account_circle_black}
                  alt="Uploaded avatar"
                  width={36}
                  height={36}
                />
                <ParticipationStatus
                  status={status}
                  className="absolute bottom-0 right-0"
                ></ParticipationStatus>
              </div>
              <span>{allDocParticipant.name}</span>
            </Link>
            <select
              className={`select-bordered select`}
              disabled={disabled}
              defaultValue={allDocParticipant.expand.participant_permission}
              onChange={async (e) => {
                const participantId = allDocParticipant.expand.participant_id;

                if (!participantId) return;

                await pbClient
                  ?.collection(Collections.Participants)
                  .update<ParticipantsResponse>(participantId, {
                    permission: e.currentTarget.value,
                  } as ParticipantsRecord);
              }}
            >
              {Object.entries(ParticipantsPermissionOptions).map(
                ([stringValue]) => (
                  <option key={stringValue} value={stringValue}>
                    {stringValue}
                  </option>
                )
              )}
            </select>
            {!disabled && (
              <button
                className="flex items-center justify-center text-gray-500 hover:text-red-400"
                onClick={async () => {
                  const participantId = allDocParticipant.expand.participant_id;

                  if (!participantId) return;

                  await pbClient
                    .collection(Collections.Participants)
                    .delete(participantId);

                  await pbClient
                    ?.apiGetList<ParticipantsCustomResponse>(
                      `/api/user/getAllDocParticipants/${docId}?fullList=true`
                    )
                    .then((value) => setAllDocParticipants(value));
                }}
              >
                <style></style>
                <span className="material-symbols-rounded [font-variation-settings:'FILL'_1,'wght'_300]">
                  cancel
                </span>
              </button>
            )}
          </li>
        );
      }),
    [
      allDocParticipants.items,
      disabled,
      docId,
      pbClient,
      user.person,
      userParticipationStatus,
    ]
  );

  return (
    <>
      {!disabled && (
        <select
          className="select-bordered select w-full"
          onChange={async (e) => {
            const newDocParticipant = await pbClient
              ?.collection(Collections.Participants)
              .create<ParticipantsResponse>({
                document: docId,
                person: e.currentTarget.value,
                permission: ParticipantsPermissionOptions.read,
              } as ParticipantsRecord);

            const allDocParticipants =
              await pbClient?.apiGetList<ParticipantsCustomResponse>(
                `/api/user/getAllDocParticipants/${docId}?fullList=true`
              );

            const allDocParticipant = allDocParticipants.items.find(
              (allDocParticipant) =>
                allDocParticipant.id == newDocParticipant.person
            );

            setAllDocParticipants(allDocParticipants);
            if (allDocParticipant)
              setTimeout(
                () => sendInvitation(allDocParticipant),
                emailInvitationDelay
              );
          }}
          disabled={newPeopleOptions.length == 0}
          value=""
        >
          <option value="" disabled>
            Add new participant
          </option>
          {newPeopleOptions.map((person) => (
            <option key={person.id} value={person.id}>
              {getParticipantOptionName(person)}
            </option>
          ))}
        </select>
      )}
      {!disabled && (
        <ImportParticipantsInput
          docId={docId}
          disabled={disabled}
          pbClient={pbClient}
        ></ImportParticipantsInput>
      )}
      <ol>
        <li
          key={owner.id}
          className="flex w-full items-center justify-center gap-2 rounded p-2 hover:bg-gray-50"
        >
          <Link
            className="flex grow items-center gap-1"
            href={`/people/${encodeURIComponent(owner.id ?? "")}`}
          >
            <ImageFallback
              className="mr-2 h-9 w-9 rounded-full"
              src={pbClient.buildUrl(
                `api/files/people/${owner.id}/${owner.avatar}?thumb=36x36`
              )}
              fallbackSrc={account_circle_black}
              alt="Uploaded avatar"
              width={36}
              height={36}
            />
            <p className="flex grow">{owner.name}</p>
            <p className="w-fit rounded bg-amber-100 px-2 py-1 font-semibold text-amber-700">
              Owner
            </p>
          </Link>
        </li>
        {participantsList}
        {userParticipation && (
          <>
            <hr />
            <div className="flex items-center gap-5 p-2">
              <select
                className={`select-bordered select`}
                defaultValue={userParticipation.expand?.participant_status}
                onChange={async (e) => {
                  const participantId =
                    userParticipation.expand?.participant_id;

                  if (!participantId) return;

                  setUserParticipationStatus(e.currentTarget.value);
                  await pbClient
                    ?.collection(Collections.Participants)
                    .update<ParticipantsResponse>(participantId, {
                      status: e.currentTarget.value,
                    } as ParticipantsRecord);
                }}
              >
                <option value="" disabled>
                  Going?
                </option>
                {Object.entries(ParticipantsStatusOptions).map(
                  ([stringValue]) => (
                    <option key={stringValue} value={stringValue}>
                      {stringValue}
                    </option>
                  )
                )}
              </select>
            </div>
          </>
        )}
      </ol>
    </>
  );
}

const approximateNameLength = 25;

function getParticipantOptionName(person: PeopleResponse) {
  const alignSpaces = Math.max(
    1,
    approximateNameLength - person.name.length ?? 0
  );
  return `${person.name} ${"-".repeat(alignSpaces)} ${person.personId}`;
}

export default ParticipantsList;
