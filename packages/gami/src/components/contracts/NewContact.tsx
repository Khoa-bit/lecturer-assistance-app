import { MD5 } from "crypto-js";
import type { RelationshipsRecord } from "raito";
import { Collections } from "raito";
import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import type { mergeRelationship } from "../../pages/relationships";

interface NewContactProps {
  newRelationshipsOptions: mergeRelationship[];
  fromPerson: string;
  pbClient: PBCustom;
  setNewRelationshipsOptions: Dispatch<SetStateAction<mergeRelationship[]>>;
  setRelationships: Dispatch<SetStateAction<mergeRelationship[]>>;
}

interface RelationshipInput extends RelationshipsRecord {
  diffHash?: string;
}

const NewContact = ({
  newRelationshipsOptions,
  fromPerson,
  pbClient,
  setNewRelationshipsOptions,
  setRelationships,
}: NewContactProps) => {
  const { register, handleSubmit } = useForm<RelationshipInput>({
    defaultValues: {
      fromPerson: fromPerson,
      toPerson: "",
      diffHash: MD5(
        SuperJSON.stringify({
          fromPerson: fromPerson,
          toPerson: "",
        } as RelationshipInput)
      ).toString(),
    },
  });

  const onSubmit: SubmitHandler<RelationshipInput> = useCallback(
    (inputData) => {
      setTimeout(async () => {
        const relationship = await pbClient
          .collection(Collections.Relationships)
          .create<mergeRelationship>(
            {
              fromPerson,
              toPerson: inputData.toPerson,
            } as RelationshipsRecord,
            {
              expand: "toPerson",
            }
          );

        setRelationships((relationships) => [...relationships, relationship]);

        setNewRelationshipsOptions((relationships) =>
          relationships.filter(
            (relationship) =>
              (relationship.expand.toPerson_id ??
                relationship.expand.toPerson.id) != inputData.toPerson
          )
        );
      }, 0);
    },
    [fromPerson, pbClient, setNewRelationshipsOptions, setRelationships]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>FromPerson: {fromPerson}</p>
      <select {...register("toPerson", { required: true })}>
        {newRelationshipsOptions.map((relationship) => {
          const toPersonId =
            relationship.expand.toPerson_id ?? relationship.expand.toPerson.id;
          const toPersonName =
            relationship.expand.toPerson_name ??
            relationship.expand.toPerson.name;
          return (
            <option key={toPersonId} value={toPersonId}>
              {toPersonName}
            </option>
          );
        })}
      </select>
      <input type="submit" />
    </form>
  );
};

export default NewContact;
