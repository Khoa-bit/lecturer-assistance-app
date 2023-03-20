import Link from "next/link";
import { Collection, ListResult } from "pocketbase";
import {
  Collections,
  ParticipantsCustomResponse,
  ParticipantsPermissionOptions,
  ParticipantsRecord,
  ParticipantsResponse,
  PeopleResponse,
  UsersResponse,
} from "raito";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { collapseToast } from "react-toastify";
import { PBCustom } from "src/types/pb-custom";

interface NewParticipantFormProps {
  docId: string;
  people: PeopleResponse<unknown>[];
  user: UsersResponse<unknown>;
  defaultValue: ListResult<ParticipantsCustomResponse>;
  pbClient: PBCustom;
  disabled: boolean;
}

interface NewParticipantFormInput {
  newPerson: string;
}

function NewParticipantForm({
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
      allDocParticipants.items.map((allDocParticipant) =>
        allDocParticipant.expand.userDocument_id_list.map(
          (userDocId, index) => {
            if (userDocId != docId) return <></>;

            return (
              <li key={allDocParticipant.id}>
                <Link
                  href={`/people/${encodeURIComponent(allDocParticipant.id)}`}
                >
                  {allDocParticipant.name}
                </Link>
                <select
                  disabled={disabled}
                  defaultValue={allDocParticipant.expand.participant_permission_list.at(
                    index
                  )}
                  onChange={async (e) => {
                    const participantId =
                      allDocParticipant.expand.participant_id_list.at(index);

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
                <button
                  onClick={async () => {
                    const participantId =
                      allDocParticipant.expand.participant_id_list.at(index);

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
                  {" - Delete"}
                </button>
              </li>
            );
          }
        )
      ),
    [allDocParticipants.items, disabled, docId, pbClient]
  );

  return (
    <>
      {!disabled && (
        <select
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

export default NewParticipantForm;
