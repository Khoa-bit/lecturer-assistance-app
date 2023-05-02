import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import type { ListResult } from "pocketbase";
import type {
  AcademicMaterialsGroupCustomResponse,
  CoursesCustomResponse,
  DepartmentsResponse,
  MajorsResponse,
  PeopleRecord,
  PeopleResponse,
  SharedDocumentsCustomResponse,
  UsersResponse,
} from "raito";
import {
  AcademicMaterialsCategoryOptions,
  Collections,
  PeopleGenderOptions,
} from "raito";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import ImageFallback from "src/components/ImageFallback";
import type { CardFormProps } from "src/components/documents/CardForm";
import CardForm from "src/components/documents/CardForm";
import type { InputProps } from "src/components/documents/Input";
import Input from "src/components/documents/Input";
import MajorDepartment, {
  fetchMajorDepartment,
  fetchOneMajorDepartment,
} from "src/components/documents/MajorDepartment";
import type {
  SelectOption,
  SelectProps,
} from "src/components/documents/Select";
import Select from "src/components/documents/Select";
import SharedDocumentsList from "src/components/documents/SharedDocumentsList";
import type { TextAreaProps } from "src/components/documents/TextArea";
import TextArea from "src/components/documents/TextArea";
import type { ToggleProps } from "src/components/documents/Toggle";
import Toggle from "src/components/documents/Toggle";
import { IcRoundBook } from "src/components/icons/IcRoundBook";
import { IcRoundContactPhone } from "src/components/icons/IcRoundContactPhone";
import { IcRoundCreate } from "src/components/icons/IcRoundCreate";
import { IcRoundInfo } from "src/components/icons/IcRoundInfo";
import { IcRoundInsertDriveFile } from "src/components/icons/IcRoundInsertDriveFile";
import { IcRoundLocationOn } from "src/components/icons/IcRoundLocationOn";
import { IcRoundMenuBook } from "src/components/icons/IcRoundMenuBook";
import { IcRoundSchool } from "src/components/icons/IcRoundSchool";
import { IcRoundScience } from "src/components/icons/IcRoundScience";
import { IcRoundWork } from "src/components/icons/IcRoundWork";
import MainLayout from "src/components/layouts/MainLayout";
import TipTapView from "src/components/wysiwyg/TipTapView";
import { createHandleAvatar } from "src/components/wysiwyg/documents/createHandleAvatar";
import { createHandlePersonThumbnail } from "src/components/wysiwyg/documents/createHandlePersonThumbnail";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import {
  dateToISOLikeButLocalOrUndefined,
  formatDate,
  formatDateToInput,
} from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import type { Education, Experience, Interests } from "src/types/peopleJSON";
import SuperJSON from "superjson";
import account_circle_black from "../../../public/account_circle_black.png";

interface DocumentData {
  person: PeopleResponse<Education, Experience, Interests, UsersExpand>;
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
  sharedDocuments: ListResult<SharedDocumentsCustomResponse> | undefined;
  compactAcademicMaterials: CompactAcademicMaterials;
  allCourses: Set<string>;
  pbAuthCookie: string;
}

interface CompactAcademicMaterials {
  [category: string]: {
    documentName: string;
    participants: string[];
    description?: string;
  }[];
}

interface UsersExpand {
  "users(person)"?: UsersResponse;
  major?: MajorsResponse;
}

interface PersonInput extends PeopleRecord<Education, Experience, Interests> {
  email?: string; // show user email
  department?: never; // only to hook into error handling of Reach-Hook-Form
  diffHash?: string;
}

function Person({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);
  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);

  const person = dataParse.person;
  const personId = person.id;
  const departments = dataParse.departments;
  const sharedDocuments = dataParse.sharedDocuments;
  const compactAcademicMaterials = dataParse.compactAcademicMaterials;
  const allCourses = dataParse.allCourses;
  const isWrite =
    !person.isFaculty || (person.isFaculty && personId == user.person);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    control,
    getValues,
  } = useForm<PersonInput>({
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
      interests: person.interests,
      contactRoom: person.contactRoom,
      contactLocation: person.contactLocation,
      isFaculty: person.isFaculty,
      education: person.education,
      experience: person.experience,
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
          interests: person.interests,
          contactRoom: person.contactRoom,
          contactLocation: person.contactLocation,
          isFaculty: person.isFaculty,
          education: person.education,
          experience: person.experience,
          deleted: person.deleted,
          diffHash: undefined,
        } as PersonInput)
      ).toString(),
    },
  });

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
          email: undefined,
          thumbnail: undefined,
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
            interests: inputData.interests,
            contactRoom: inputData.contactRoom,
            contactLocation: inputData.contactLocation,
            isFaculty: inputData.isFaculty,
            education: inputData.education,
            experience: inputData.experience,
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
    trigger,
  });

  const values = getValues();

  const { data: majorDepartmentData } = useQuery(
    "majorDepartment",
    async () => {
      if (!values.major) return;
      return await fetchOneMajorDepartment(values.major, pbClient);
    }
  );

  const academicMaterialsDisplay = useMemo(() => {
    const categories: React.ReactNode[] = [];
    for (const [key, values] of Object.entries(compactAcademicMaterials)) {
      if (values.length == 0) continue;
      categories.push(
        <>
          <h4>{key}</h4>
          <ol>
            {values.map((value) => (
              <>
                <li key={value.documentName}>
                  <b>{value.documentName}</b>
                </li>
                <ul>
                  <li>
                    <i>Participants: </i>
                    {value.participants.join(", ")}
                  </li>
                  <li>
                    <i>Description: </i>
                    <TipTapView
                      key="TipTapComponent"
                      richText={value.description ?? "{}"}
                    ></TipTapView>
                  </li>
                </ul>
              </>
            ))}
          </ol>
        </>
      );
    }

    return <>{categories}</>;
  }, [compactAcademicMaterials]);

  const [isDisplay, setIsDisplay] = useState(true);
  const display = useMemo(() => {
    const interests = values.interests?.map((interest) => (
      <>
        <p className="grid grid-cols-[1fr_4fr] gap-3">
          <b>{interest.name}</b>
          <span>{`${interest.description}`}</span>
        </p>
      </>
    ));

    const education = values.education?.map((education, index) => (
      <section key={index}>
        <h4 className="mt-0">
          {education.school}
          {!!education.location && ` - ${education.location}`}
        </h4>
        <p className="m-0">
          {education.degree} - {education.fieldOfStudy}
        </p>
        <small className="text-gray-500">{`${formatDate(
          education.startTime,
          "MMM yyyy"
        )} - ${
          education.isCurrent
            ? "Present"
            : formatDate(education.endTime, "MMM yyyy")
        }`}</small>
        <p className="m-0 mt-1">Grade: {education.grade}</p>
        <p className="m-0 mt-2">{education.description}</p>
      </section>
    ));

    const experience = values.experience?.map((experience, index) => (
      <section className="flex flex-col" key={index}>
        <h4 className="mt-0">{experience.title}</h4>
        <p className="m-0">
          {experience.companyName}
          {!!experience.industry && ` - ${experience.industry}`}
        </p>
        <small>{`${formatDate(experience.startTime, "MMM yyyy")} - ${
          experience.isCurrent
            ? "Present"
            : formatDate(experience.endTime, "MMM yyyy")
        }`}</small>
        <small className="text-gray-500">{experience.location}</small>
        <p className="m-0 mt-2">{experience.description}</p>
      </section>
    ));

    return (
      <section className="col-start-2 my-4 grid h-fit w-full grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)] gap-4 rounded-lg bg-white px-6 py-5">
        <section className="prose col-span-2 max-w-full">
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundInfo className="h-6 text-gray-500"></IcRoundInfo>
            <span>Status</span>
          </h3>
          <b>{values.title}</b>
          <p className="grid grid-cols-[1fr_4fr] gap-3">
            <span>Department:</span>
            <span>{majorDepartmentData?.majorDepartment.name}</span>
            <span>Major:</span>
            <span>
              {majorDepartmentData?.majorDepartment.expand?.department.name}
            </span>
          </p>
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundLocationOn className="h-6 text-gray-500"></IcRoundLocationOn>
            <span>Address</span>
          </h3>
          <p className="grid grid-cols-[1fr_4fr] gap-3">
            <span>Room:</span>
            <span>{values.contactRoom}</span>
            <span>Location:</span>
            <span>{values.contactLocation}</span>
          </p>
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundContactPhone className="h-6 text-gray-500"></IcRoundContactPhone>
            <span>Contacts</span>
          </h3>
          <p className="grid grid-cols-[1fr_4fr] gap-3">
            {values.personId && (
              <>
                <span>ID:</span>
                <span>{values.personId}</span>
              </>
            )}
            <span>Phone:</span>
            <span>{values.phone}</span>
            <span>Email:</span>
            <span>
              {[values.personalEmail, person.expand?.["users(person)"]?.email]
                .filter((email) => email != undefined && email != "")
                .join(", ")}
            </span>
          </p>
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundScience className="h-6 text-gray-500"></IcRoundScience>
            <span>Fields of Interest</span>
          </h3>
          {interests}
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundMenuBook className="h-6 text-gray-500"></IcRoundMenuBook>
            <span>Teaching Courses</span>
          </h3>
          <p>{Array.from(allCourses.values()).join(", ")}</p>
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundSchool className="h-6 text-gray-500"></IcRoundSchool>
            <span>Education</span>
          </h3>
          {education}
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundWork className="h-6 text-gray-500"></IcRoundWork>
            <span>Experience</span>
          </h3>
          {experience}
          <h3 className="flex items-center gap-2 border-b-2">
            <IcRoundBook className="h-6 text-gray-500"></IcRoundBook>
            <span>Academic materials</span>
          </h3>
          {academicMaterialsDisplay}
        </section>
        <button
          className={`flex justify-center gap-2 rounded bg-gray-400 py-2 font-semibold text-white transition-colors hover:bg-blue-400`}
          onClick={() => setIsDisplay(false)}
        >
          <IcRoundCreate className="h-6"></IcRoundCreate>
          Edit
        </button>
      </section>
    );
  }, [
    academicMaterialsDisplay,
    allCourses,
    majorDepartmentData?.majorDepartment.expand?.department.name,
    majorDepartmentData?.majorDepartment.name,
    person.expand,
    values.contactLocation,
    values.contactRoom,
    values.education,
    values.experience,
    values.interests,
    values.personId,
    values.personalEmail,
    values.phone,
    values.title,
  ]);

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
            className={`input-ghost input w-full text-2xl font-bold`}
            {...register("name", { required: true, disabled: !isWrite })}
            placeholder="Title"
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
        {isDisplay ? (
          display
        ) : (
          <form
            className="col-start-2 my-4 grid h-fit w-full grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)] gap-4 rounded-lg bg-white px-6 py-5"
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              {...({
                name: "title",
                id: "title",
                label: "Title / Position",
                register,
                options: { required: true, disabled: !isWrite },
              } as InputProps<PersonInput>)}
            ></Input>
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
                options: { disabled: !isWrite },
              } as InputProps<PersonInput>)}
            ></Input>
            <Input
              {...({
                name: "phone",
                id: "phone",
                label: "Phone",
                register,
                options: { disabled: !isWrite },
              } as InputProps<PersonInput>)}
            ></Input>
            <Input
              {...({
                name: "personalEmail",
                id: "personalEmail",
                label: "Personal email",
                register,
                options: { disabled: !isWrite },
              } as InputProps<PersonInput>)}
            ></Input>
            <Input
              {...({
                name: "contactRoom",
                id: "contactRoom",
                label: "Contact Room",
                register,
                options: { disabled: !isWrite },
              } as InputProps<PersonInput>)}
            ></Input>
            <Input
              {...({
                name: "contactLocation",
                id: "contactLocation",
                label: "Contact Location",
                register,
                options: { disabled: !isWrite },
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
                options: { required: true, disabled: !isWrite },
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
              // This is usually get injected and without type check any way
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              register={register as any}
              options={{ disabled: !isWrite }}
            ></MajorDepartment>

            <CardForm
              {...({
                name: "interests",
                id: "interests",
                label: "Interests",
                defaultValue: { name: "", description: "" },
                register,
                control,
                options: { disabled: !isWrite },
                childrenFactory: (index) => (
                  <>
                    <Input
                      {...({
                        name: `interests.${index}.name` as const,
                        id: `interests.${index}.name` as const,
                        label: "Name",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <TextArea
                      {...({
                        name: `interests.${index}.description` as const,
                        id: `interests.${index}.description` as const,
                        label: "Description",
                        register,
                        options: { disabled: !isWrite },
                      } as TextAreaProps<PersonInput>)}
                    ></TextArea>
                  </>
                ),
              } as CardFormProps<PersonInput>)}
            ></CardForm>

            <CardForm
              {...({
                name: "education",
                id: "education",
                label: "Education",
                defaultValue: {
                  school: "",
                  degree: "",
                  fieldOfStudy: "",
                  location: "",
                  grade: "",
                  startTime: formatDateToInput(new Date()),
                  endTime: undefined,
                  isCurrent: true,
                  description: "",
                },
                register,
                control,
                options: { disabled: !isWrite },
                childrenFactory: (index) => (
                  <>
                    <Input
                      {...({
                        name: `education.${index}.school` as const,
                        id: `education.${index}.school` as const,
                        label: "School",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `education.${index}.degree` as const,
                        id: `education.${index}.degree` as const,
                        label: "Degree",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `education.${index}.fieldOfStudy` as const,
                        id: `education.${index}.fieldOfStudy` as const,
                        label: "Field of study",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `education.${index}.location` as const,
                        id: `education.${index}.location` as const,
                        label: "Location",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `education.${index}.grade` as const,
                        id: `education.${index}.grade` as const,
                        label: "Grade",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `education.${index}.startTime` as const,
                        id: `education.${index}.startTime` as const,
                        label: "State date",
                        type: "datetime-local",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Toggle
                      {...({
                        name: `education.${index}.isCurrent` as const,
                        id: `education.${index}.isCurrent` as const,
                        label: "Currently studying",
                        register,
                        options: { disabled: !isWrite },
                      } as ToggleProps<PersonInput>)}
                    ></Toggle>
                    <Input
                      {...({
                        name: `education.${index}.endTime` as const,
                        id: `education.${index}.endTime` as const,
                        label: "End date",
                        type: "datetime-local",
                        register,
                        options: {
                          disabled:
                            !isWrite ||
                            getValues(`education.${index}.isCurrent` as const),
                        },
                        min: dateToISOLikeButLocalOrUndefined(
                          getValues(`education.${index}.startTime` as const)
                        ),
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <TextArea
                      {...({
                        name: `education.${index}.description` as const,
                        id: `education.${index}.description` as const,
                        label: "Description",
                        register,
                        options: { disabled: !isWrite },
                      } as TextAreaProps<PersonInput>)}
                    ></TextArea>
                  </>
                ),
              } as CardFormProps<PersonInput>)}
            ></CardForm>

            <CardForm
              {...({
                name: "experience",
                id: "experience",
                label: "Experience",
                defaultValue: {
                  title: "",
                  companyName: "",
                  location: "",
                  startTime: formatDateToInput(new Date()),
                  endTime: undefined,
                  isCurrent: true,
                  industry: "",
                  description: "",
                },
                register,
                control,
                options: { disabled: !isWrite },
                childrenFactory: (index) => (
                  <>
                    <Input
                      {...({
                        name: `experience.${index}.title` as const,
                        id: `experience.${index}.title` as const,
                        label: "Title",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `experience.${index}.companyName` as const,
                        id: `experience.${index}.companyName` as const,
                        label: "Company name",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `experience.${index}.location` as const,
                        id: `experience.${index}.location` as const,
                        label: "Location",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `experience.${index}.startTime` as const,
                        id: `experience.${index}.startTime` as const,
                        label: "Start date",
                        type: "datetime-local",
                        register,
                        options: { required: true, disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Toggle
                      {...({
                        name: `experience.${index}.isCurrent` as const,
                        id: `experience.${index}.isCurrent` as const,
                        label: "Currently working",
                        register,
                        options: { disabled: !isWrite },
                      } as ToggleProps<PersonInput>)}
                    ></Toggle>
                    <Input
                      {...({
                        name: `experience.${index}.endTime` as const,
                        id: `experience.${index}.endTime` as const,
                        label: "End date",
                        type: "datetime-local",
                        register,
                        options: {
                          disabled:
                            !isWrite ||
                            getValues(`experience.${index}.isCurrent` as const),
                        },
                        min: dateToISOLikeButLocalOrUndefined(
                          getValues(`experience.${index}.startTime` as const)
                        ),
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <Input
                      {...({
                        name: `experience.${index}.industry` as const,
                        id: `experience.${index}.industry` as const,
                        label: "Industry",
                        register,
                        options: { disabled: !isWrite },
                      } as InputProps<PersonInput>)}
                    ></Input>
                    <TextArea
                      {...({
                        name: `experience.${index}.description` as const,
                        id: `experience.${index}.description` as const,
                        label: "Description",
                        register,
                        options: { disabled: !isWrite },
                      } as TextAreaProps<PersonInput>)}
                    ></TextArea>
                  </>
                ),
              } as CardFormProps<PersonInput>)}
            ></CardForm>

            <button
              className={`flex justify-center gap-2 rounded bg-gray-400 py-2 font-semibold text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-gray-200`}
              onClick={() => setIsDisplay(true)}
              disabled={!isWrite}
            >
              <IcRoundInsertDriveFile className="h-6"></IcRoundInsertDriveFile>
              Display
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
        )}
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
    .getOne<PeopleResponse<Education, Experience, Interests, UsersExpand>>(
      personId,
      {
        expand: "users(person),major",
      }
    );

  const { departments, majorOptions } = await fetchMajorDepartment(
    person.expand?.major?.department ?? "",
    pbServer
  );

  const sharedDocuments =
    await pbServer.apiGetList<SharedDocumentsCustomResponse>(
      `/api/user/getSharedDocuments/${personId}?fullList=true`
    );

  const academicMaterialsGroupCustomResponse =
    await pbServer.apiGetList<AcademicMaterialsGroupCustomResponse>(
      "/api/user/getAcademicMaterialsWithParticipants"
    );

  const compactAcademicMaterials: CompactAcademicMaterials = {};
  Object.keys(AcademicMaterialsCategoryOptions).forEach((categoryOptions) => {
    compactAcademicMaterials[categoryOptions] = [];
  });
  for (const userDocument of academicMaterialsGroupCustomResponse.items) {
    const categoryKey =
      userDocument.expand.academicMaterial_category_list.at(0) ?? "Unknown";
    (compactAcademicMaterials[categoryKey] ??= []).push({
      documentName: userDocument.name,
      participants: userDocument.expand.person_name_list,
      description: userDocument.richText,
    });
  }

  const lectureCourses = await pbServer.apiGetList<CoursesCustomResponse>(
    "/api/user/getCourses"
  );

  const participatedLectureCourses =
    await pbServer.apiGetList<CoursesCustomResponse>(
      "/api/user/getParticipatedCourses?fullList=true"
    );

  const allCourses = new Set<string>();
  for (const course of lectureCourses.items) {
    allCourses.add(course.expand.courseTemplate_name);
  }
  for (const course of participatedLectureCourses.items) {
    allCourses.add(course.expand.courseTemplate_name);
  }

  return {
    props: {
      data: SuperJSON.stringify({
        person,
        departments,
        majorOptions,
        sharedDocuments,
        compactAcademicMaterials,
        allCourses,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Person.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Person;
