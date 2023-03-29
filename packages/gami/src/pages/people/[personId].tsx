import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import type {
  DepartmentsResponse,
  MajorsResponse,
  ParticipantsCustomResponse,
  PeopleRecord,
  PeopleResponse,
  UsersResponse,
} from "raito";
import { Collections, PeopleGenderOptions } from "raito";
import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import MajorDepartment, {
  fetchMajorDepartment,
} from "src/components/documents/MajorDepartment";
import ParticipateDetailList from "src/components/documents/ParticipateDetailList";
import MainLayout from "src/components/layouts/MainLayout";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  person: PeopleResponse<UsersExpand>;
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
  allDocParticipation: ParticipantsCustomResponse | undefined;
  pbAuthCookie: string;
}

interface UsersExpand {
  "users(person)": UsersResponse;
  major?: MajorsResponse;
}

interface PersonInput extends PeopleRecord {
  department?: never; // only to hook into error handling of Reach-Hook-Form
  diffHash?: string;
}

function Person({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const person = dataParse.person;
  const personId = person.id;
  const departments = dataParse.departments;
  const allDocParticipation = dataParse.allDocParticipation;

  const { register, handleSubmit, setValue, control, watch } =
    useForm<PersonInput>({
      defaultValues: {
        personId: person.personId,
        name: person.name,
        avatar: person.avatar,
        phone: person.phone,
        personalEmail: person.personalEmail,
        title: person.title,
        placeOfBirth: person.placeOfBirth,
        gender: person.gender,
        major: person.major,
        deleted: person.deleted,
        diffHash: MD5(
          SuperJSON.stringify({
            personId: person.personId,
            name: person.name,
            avatar: undefined,
            phone: person.phone,
            personalEmail: person.personalEmail,
            title: person.title,
            placeOfBirth: person.placeOfBirth,
            gender: person.gender,
            major: person.major,
            deleted: person.deleted,
            diffHash: undefined,
          } as PersonInput)
        ).toString(),
      },
    });

  const [avatar, setAvatar] = useState<string | undefined>(person.avatar);

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);
  const hasSaved = useRef(true);

  const onSubmit: SubmitHandler<PersonInput> = useCallback(
    (inputData) => {
      const prevDiffHash = inputData.diffHash;
      const newDiffHash = MD5(
        SuperJSON.stringify({
          ...inputData,
          avatar: undefined,
          diffHash: undefined,
        } as PersonInput)
      ).toString();

      if (prevDiffHash != newDiffHash) {
        setValue("diffHash", newDiffHash);
        pbClient
          .collection(Collections.People)
          .update<PeopleResponse>(personId, {
            personId: undefined,
            name: inputData.name,
            avatar: inputData.avatar,
            phone: inputData.phone,
            personalEmail: inputData.personalEmail,
            title: inputData.title,
            placeOfBirth: inputData.placeOfBirth,
            gender: inputData.gender,
            major: inputData.major,
            deleted: undefined,
          } as PeopleRecord);
      }
    },
    [pbClient, personId, setValue]
  );

  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLInputElement>(null);

  useSaveDoc({
    hasSaved,
    formRef,
    submitRef,
    watch,
  });

  return (
    <>
      <Head>
        <title>Person information</title>
      </Head>
      <h1>Person information</h1>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true })} />
        <input {...register("personId")} />
        <Controller
          name="avatar"
          control={control}
          render={({ field: { name, onChange } }) => (
            <>
              <label htmlFor="file">Choose avatar image to upload</label>
              <input
                id="file"
                type="file"
                name={name}
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.item(0);
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("avatar", file);

                  const personAvatar = await pbClient
                    .collection(Collections.People)
                    .update<PeopleResponse>(personId, formData);
                  setAvatar(personAvatar.avatar);

                  onChange({
                    target: { value: personAvatar.avatar, name },
                  });
                }}
              />
            </>
          )}
        />
        <input {...register("phone")} />
        <input {...register("personalEmail")} />
        <input {...register("title", { required: true })} />
        <input {...register("placeOfBirth")} />
        <select {...register("gender", { required: true })}>
          {Object.entries(PeopleGenderOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <MajorDepartment
          name="major"
          initDepartmentId={person.expand?.major?.department ?? ""}
          initMajorOptions={dataParse.majorOptions}
          departments={departments}
          pbClient={pbClient}
        ></MajorDepartment>
        <input ref={submitRef} type="submit" />
      </form>

      {allDocParticipation && (
        <ParticipateDetailList
          participant={allDocParticipation}
        ></ParticipateDetailList>
      )}

      {avatar && (
        <Image
          src={pbClient.buildUrl(`api/files/people/${personId}/${avatar}`)}
          alt="Uploaded avatar"
          width={500}
          height={500}
        />
      )}
    </>
  );
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);
  const personId = query.personId as string;

  const person = await pbServer
    .collection(Collections.People)
    .getOne<PeopleResponse<UsersExpand>>(personId, {
      expand: "users(person),major",
    });

  const { departments, majorOptions } = await fetchMajorDepartment(
    person.expand?.major?.department ?? "",
    pbServer
  );

  const allDocParticipation = (
    await pbServer.apiGetList<ParticipantsCustomResponse>(
      `/api/user/getAllDocParticipation/${personId}?fullList=true`
    )
  ).items.at(0);

  return {
    props: {
      data: SuperJSON.stringify({
        person,
        departments,
        majorOptions,
        allDocParticipation,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Person.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Person;
