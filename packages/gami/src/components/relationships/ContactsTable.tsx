import Link from "next/link";
import type {ListResult} from "pocketbase";
import type {
  ContactsCustomResponse,
  RelationshipsRecord,
  RelationshipsResponse,
  StarredContactsCustomResponse,
  UsersResponse,
} from "src/types/raito";
import {Collections} from "src/types/raito";
import type {SetStateAction} from "react";
import {useCallback} from "react";
import type {PBCustom} from "src/types/pb-custom";

interface ContactsTableProps {
  contacts: ListResult<ContactsCustomResponse | StarredContactsCustomResponse>;
  isStarTable: boolean;
  pbClient: PBCustom;
  user: UsersResponse;
  starredContacts?: ListResult<StarredContactsCustomResponse>;
  setStarredContacts: (
    value: SetStateAction<ListResult<StarredContactsCustomResponse>>
  ) => void;
}

function ContactsTable({
                         contacts,
                         isStarTable,
                         pbClient,
                         user,
                         starredContacts,
                         setStarredContacts,
                       }: ContactsTableProps) {
  const createStarButton = useCallback(
    (contact: ContactsCustomResponse | StarredContactsCustomResponse) => {
      // Provide remove star function for ContactsTable by looping through the starredContacts.items to find a match
      // then return <RemoveStar> button for that starredContacts
      if (!isStarTable && starredContacts) {
        for (const starredContact of starredContacts.items) {
          if (contact.id != starredContact.id) continue;

          return (
            <RemoveStar
              pbClient={pbClient}
              contact={starredContact}
              setStarredContacts={setStarredContacts}
            ></RemoveStar>
          );
        }
      }

      let StarButton: JSX.Element;

      if (isStarTable && isStarredContacts(contact)) {
        StarButton = (
          <RemoveStar
            pbClient={pbClient}
            contact={contact}
            setStarredContacts={setStarredContacts}
          ></RemoveStar>
        );
      } else {
        StarButton = (
          <AddStar
            pbClient={pbClient}
            user={user}
            contact={contact}
            setStarredContacts={setStarredContacts}
          ></AddStar>
        );
      }

      return StarButton;
    },
    [isStarTable, pbClient, setStarredContacts, starredContacts, user]
  );

  const contactsList = contacts.items.map((person, index) => (
    <tr
      key={person.id}
      className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
    >
      <td>
        <Link
          className="block w-6 truncate p-2 text-right"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {index + 1}
        </Link>
      </td>
      <td>{createStarButton(person)}</td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.name}
        </Link>
      </td>
      <td>
        <Link
          className="block w-full max-w-xs truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.personId}
        </Link>
      </td>
      <td>
        <Link
          className="block w-44 truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {person.title}
        </Link>
      </td>
      <td>
        <Link
          className="block w-44 truncate p-2"
          href={`/people/${encodeURIComponent(person.id)}`}
        >
          {[person.personalEmail, person.expand.user_email]
            .filter((email) => email != undefined && email != "")
            .join(", ")}
        </Link>
      </td>
      <td>
        <Link
          className="block w-10 truncate py-1 px-2"
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
        <tr>
          <th className="!static w-6 p-2">No.</th>
          <th className="w-7 truncate pl-1"></th>
          <th className="max-w-xs truncate p-2">Name</th>
          <th className="max-w-xs truncate p-2">ID</th>
          <th className="w-44 truncate p-2">Position</th>
          <th className="w-44 truncate p-2">Email</th>
          <th className="w-10 truncate p-2"></th>
        </tr>
        </thead>
        <tbody>{contactsList}</tbody>
      </table>
    </div>
  );
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
      <span
        className="material-symbols-rounded text-yellow-500 [font-variation-settings:'FILL'_1] hover:text-yellow-400">
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

export default ContactsTable;
