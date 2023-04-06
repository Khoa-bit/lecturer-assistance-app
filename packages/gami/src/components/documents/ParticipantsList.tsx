import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  ParticipantsCustomResponse,
  ParticipantsRecord,
  ParticipantsResponse,
  PeopleResponse,
  UsersResponse,
} from "raito";
import { Collections, ParticipantsPermissionOptions } from "raito";
import { useMemo, useState } from "react";
import type { PBCustom } from "src/types/pb-custom";
import account_circle_black from "../../../public/account_circle_black.png";
import ImageFallback from "../ImageFallback";

interface NewParticipantFormProps {
  docId: string;
  people: PeopleResponse<unknown>[];
  user: UsersResponse<unknown>;
  defaultValue: ListResult<ParticipantsCustomResponse>;
  pbClient: PBCustom;
  disabled: boolean;
}

function ParticipantsList({
  docId,
  people,
  user,
  defaultValue,
  pbClient,
  disabled,
}: NewParticipantFormProps) {
  const [allDocParticipants, setAllDocParticipants] = useState(defaultValue);

  const newPeopleOptions = useMemo(
    () =>
      people.filter(
        (person) =>
          !allDocParticipants.items.some(
            (allDocParticipant) => allDocParticipant.id == person.id
          ) && user.person != person.id
      ),
    [allDocParticipants.items, people, user.person]
  );

  const participantsList = useMemo(
    () =>
      allDocParticipants.items.map((allDocParticipant) => {
        return (
          <li
            key={allDocParticipant.id}
            className="flex w-full items-center justify-center gap-2 rounded p-2 hover:bg-gray-50"
          >
            <Link
              className="flex grow items-center"
              href={`/people/${encodeURIComponent(allDocParticipant.id)}`}
            >
              <ImageFallback
                className="mr-2 h-9 w-9 rounded-full"
                src={pbClient.buildUrl(
                  `api/files/people/${allDocParticipant?.id}/${allDocParticipant?.avatar}?thumb=36x36`
                )}
                fallbackSrc={account_circle_black}
                alt="Uploaded avatar"
                width={36}
                height={36}
              />
              {allDocParticipant.name}
            </Link>
            <select
              className={`rounded border border-gray-300 hover:bg-gray-50 ${
                disabled && "bg-gray-50 text-gray-500"
              }`}
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
    [allDocParticipants.items, disabled, docId, pbClient]
  );

  return (
    <>
      {!disabled && (
        <select
          className="mb-3 w-full rounded border border-gray-300 hover:bg-gray-50"
          onChange={async (e) => {
            await pbClient
              ?.collection(Collections.Participants)
              .create<ParticipantsResponse>({
                document: docId,
                person: e.currentTarget.value,
                permission: ParticipantsPermissionOptions.read,
              } as ParticipantsRecord);

            await pbClient
              ?.apiGetList<ParticipantsCustomResponse>(
                `/api/user/getAllDocParticipants/${docId}?fullList=true`
              )
              .then((value) => setAllDocParticipants(value));
          }}
          disabled={newPeopleOptions.length == 0}
          value=""
        >
          <option value="" disabled hidden>
            Add new participant
          </option>
          {newPeopleOptions.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      )}
      <ol>{participantsList}</ol>
    </>
  );
}

export default ParticipantsList;
