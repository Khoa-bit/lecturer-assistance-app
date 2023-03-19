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
  PeopleRecord,
  PeopleResponse,
  UsersResponse,
} from "raito";
import { Collections, PeopleGenderOptions } from "raito";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import MainLayout from "src/components/layouts/MainLayout";
import { debounce } from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  person: PeopleResponse<UsersExpand>;
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
  pbAuthCookie: string;
}

interface UsersExpand {
  "users(person)": UsersResponse;
  major?: MajorsResponse;
}

interface PersonInput extends PeopleRecord {
  department?: string;
  diffHash?: string;
}

function Person({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const person = dataParse.person;
  const personId = person.id;
  const departments = dataParse.departments;
  const [departmentId, setDepartmentId] = useState<string>(
    person.expand?.major?.department ?? ""
  );
  const [majorOptions, setMajorOptions] = useState<MajorsResponse[]>(
    dataParse.majorOptions
  );

  const { register, handleSubmit, setValue, control } = useForm<PersonInput>({
    defaultValues: {
      personId: person.personId,
      name: person.name,
      avatar: person.avatar,
      phone: person.phone,
      personalEmail: person.personalEmail,
      title: person.title,
      placeOfBirth: person.placeOfBirth,
      gender: person.gender,
      department: departmentId, // person.expand?.major?.department,
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
          department: departmentId, // person.expand?.major?.department,
          major: person.major,
          deleted: person.deleted,
          diffHash: undefined,
        } as PersonInput)
      ).toString(),
    },
  });

  const [avatar, setAvatar] = useState<string | undefined>(person.avatar);

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);

  useEffect(() => {
    setTimeout(async () => {
      const majorOptions = await pbClient
        .collection(Collections.Majors)
        .getFullList<MajorsResponse>({
          filter: `department="${departmentId}"`,
        })
        .catch(() => undefined);

      if (majorOptions) setMajorOptions(majorOptions);
    }, 0);
  }, [departmentId, pbClient]);

  const formRef = useRef<HTMLFormElement>(null);
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

  const submitForm = useCallback(
    () => handleSubmit(onSubmit)(),
    [handleSubmit, onSubmit]
  );
  const debouncedSave = debounce(() => submitForm(), 1000);

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        // Prevent the Save dialog to open
        e.preventDefault();
        // Place your code here
        debouncedSave();
      }
    };
    document.addEventListener("keydown", keyDownEvent);

    return () => document.removeEventListener("keydown", keyDownEvent);
  }, [debouncedSave]);

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
        <select
          {...register("department", { required: true })}
          onChange={(event) => {
            setDepartmentId(event.currentTarget.value);
          }}
        >
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <select {...register("major", { required: true })}>
          {majorOptions?.map((major) => (
            <option key={major.id} value={major.id}>
              {major.name}
            </option>
          ))}
        </select>
        <input type="submit" />
      </form>

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

  const departments = await pbServer
    .collection(Collections.Departments)
    .getFullList<DepartmentsResponse>({});

  const majorOptions = await pbServer
    .collection(Collections.Majors)
    .getFullList<MajorsResponse>({
      filter: `department="${person.expand?.major?.department}"`,
    });

  return {
    props: {
      data: SuperJSON.stringify({
        person,
        departments,
        majorOptions,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Person.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Person;
