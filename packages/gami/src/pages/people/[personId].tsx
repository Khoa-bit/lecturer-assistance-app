import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type {
  DepartmentsResponse,
  SharedDocumentsCustomResponse,
  MajorsResponse,
  PeopleRecord,
  PeopleResponse,
  UsersResponse,
} from "raito";
import { Collections, PeopleGenderOptions } from "raito";
import { useCallback, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { InputProps } from "src/components/documents/Input";
import Input from "src/components/documents/Input";
import MajorDepartment, {
  fetchMajorDepartment,
} from "src/components/documents/MajorDepartment";
import SharedDocumentsList from "src/components/documents/SharedDocumentsList";
import type {
  SelectOption,
  SelectProps,
} from "src/components/documents/Select";
import Select from "src/components/documents/Select";
import ImageFallback from "src/components/ImageFallback";
import MainLayout from "src/components/layouts/MainLayout";
import { createHandleAvatar } from "src/components/wysiwyg/documents/createHandleAvatar";
import { createHandlePersonThumbnail } from "src/components/wysiwyg/documents/createHandlePersonThumbnail";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";
import account_circle_black from "../../../public/account_circle_black.png";
import type { ListResult } from "pocketbase";

interface DocumentData {
  person: PeopleResponse<UsersExpand>;
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
  sharedDocuments: ListResult<SharedDocumentsCustomResponse> | undefined;
  pbAuthCookie: string;
}

interface UsersExpand {
  "users(person)": UsersResponse;
  major?: MajorsResponse;
}

interface PersonInput extends PeopleRecord {
  email?: string; // show user email
  department?: never; // only to hook into error handling of Reach-Hook-Form
  diffHash?: string;
}

function Person({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const person = dataParse.person;
  const personId = person.id;
  const departments = dataParse.departments;
  const sharedDocuments = dataParse.sharedDocuments;
  const isWrite = true;

  console.log(person);

  const { register, handleSubmit, setValue, watch } = useForm<PersonInput>({
    defaultValues: {
      personId: person.personId,
      name: person.name,
      avatar: person.avatar,
      phone: person.phone,
      email: person.expand?.["users(person)"]?.email,
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

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);

  // Custom input field that is outside of the form
  const registerAvatar = register("avatar", { disabled: !isWrite });
  const registerThumbnail = register("thumbnail", { disabled: !isWrite });

  const [avatar, setAvatar] = useState<string | undefined>(person.avatar);
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    person.thumbnail
  );

  const handleAvatar = createHandleAvatar(pbClient, personId, setAvatar);
  const handleThumbnail = createHandlePersonThumbnail(
    pbClient,
    personId,
    setThumbnail
  );

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

  const hasSaved = useSaveDoc({
    formRef,
    submitRef,
    watch,
  });

  // This css is currently duplicated with FullDocument.tsx component
  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col items-center px-4">
      <Head>
        <title>Person information</title>
      </Head>
      <div className="w-screen pb-6">
        {thumbnail && (
          <Image
            className="h-36 w-full xl:h-48"
            src={pbClient.buildUrl(`api/files/people/${personId}/${thumbnail}`)}
            alt="Uploaded image thumbnail"
            width={1700}
            height={192}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <header className="flex w-full items-start gap-x-4">
        <label htmlFor="avatar">
          <ImageFallback
            className="h-16 w-16 cursor-pointer rounded-full shadow hover:bg-slate-300 hover:grayscale"
            src={pbClient.buildUrl(`api/files/people/${personId}/${avatar}`)}
            fallbackSrc={account_circle_black}
            alt="Person avatar"
            width={64}
            height={64}
          />
        </label>
        <input
          id="avatar"
          className={`hidden`}
          type="file"
          {...registerAvatar}
          onChange={(e) => {
            registerAvatar.onChange(e);
            handleAvatar(e);
          }}
          accept="image/*"
        />

        <h1 className="flex-grow">
          <input
            className={`input-bordered input h-10 w-full rounded bg-transparent text-2xl font-bold focus:bg-white`}
            {...register("name", { required: true, disabled: !isWrite })}
            placeholder="Person name"
          />
        </h1>
        {isWrite && (
          <>
            <label
              htmlFor="thumbnail"
              className={`flex h-10 cursor-pointer items-center gap-1 rounded bg-gray-200 p-2 font-semibold hover:bg-gray-300`}
            >
              <span className="material-symbols-rounded text-gray-500 [font-variation-settings:'FILL'_1]">
                image
              </span>
              <span>Change thumbnail</span>
            </label>
            <input
              id="thumbnail"
              className={`hidden`}
              type="file"
              {...registerThumbnail}
              onChange={(e) => {
                registerThumbnail.onChange(e);
                handleThumbnail(e);
              }}
              accept="image/*"
            />
          </>
        )}
      </header>
      <section className="w-full xl:grid xl:grid-cols-[1fr_2fr] xl:gap-4">
        {sharedDocuments && (
          <SharedDocumentsList
            sharedDocuments={sharedDocuments}
          ></SharedDocumentsList>
        )}

        <form
          className="my-4 grid h-fit w-full grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)] gap-4 rounded-lg bg-white px-6 py-5"
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            {...({
              name: "email",
              id: "email",
              label: "University email",
              register,
              options: { disabled: true },
            } as InputProps)}
          ></Input>
          <Input
            {...({
              name: "personId",
              id: "personId",
              label: "Person ID",
              register,
              options: {},
            } as InputProps<PersonInput>)}
          ></Input>
          <Input
            {...({
              name: "phone",
              id: "phone",
              label: "Phone",
              register,
              options: {},
            } as InputProps<PersonInput>)}
          ></Input>
          <Input
            {...({
              name: "personalEmail",
              id: "personalEmail",
              label: "Personal email",
              register,
              options: {},
            } as InputProps<PersonInput>)}
          ></Input>
          <Input
            {...({
              name: "title",
              id: "title",
              label: "Title / Position",
              register,
              options: { required: true },
            } as InputProps<PersonInput>)}
          ></Input>
          <Input
            {...({
              name: "placeOfBirth",
              id: "placeOfBirth",
              label: "Place of birth",
              register,
              options: {},
            } as InputProps<PersonInput>)}
          ></Input>
          <Select
            {...({
              name: "gender",
              id: "gender",
              label: "Gender",
              selectOptions: Object.entries(PeopleGenderOptions).map(
                ([stringValue]) => {
                  return {
                    key: stringValue,
                    value: stringValue,
                    content: stringValue,
                  } as SelectOption;
                }
              ),
              register,
              options: { required: true },
            } as SelectProps<PersonInput>)}
          >
            <option value="" disabled>
              Select gender
            </option>
          </Select>
          <MajorDepartment
            name="major"
            initDepartmentId={person.expand?.major?.department ?? ""}
            initMajorOptions={dataParse.majorOptions}
            departments={departments}
            pbClient={pbClient}
          ></MajorDepartment>
          <button
            className={`flex justify-center gap-2 rounded bg-gray-400 py-2 font-semibold text-white transition-colors hover:bg-blue-400`}
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            <span className="material-symbols-rounded">arrow_back</span>
            Back
          </button>
          <input
            className={`rounded bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-400 ${
              hasSaved && "bg-gray-300 hover:bg-gray-300"
            }`}
            ref={submitRef}
            type="submit"
            disabled={!isWrite}
            value="Save"
          />
        </form>
      </section>
    </main>
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

  const sharedDocuments =
    await pbServer.apiGetList<SharedDocumentsCustomResponse>(
      `/api/user/getSharedDocuments/${personId}?fullList=true`
    );

  return {
    props: {
      data: SuperJSON.stringify({
        person,
        departments,
        majorOptions,
        sharedDocuments,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Person.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Person;
