import { MD5 } from "crypto-js";
import Image from "next/image";
import { useRouter } from "next/router";
import type { ListResult } from "pocketbase";
import type {
  AttachmentsResponse,
  ParticipantsCustomResponse,
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
  PeopleResponse,
  UsersResponse,
} from "raito";
import {
  Collections,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  EventDocumentsRecurringOptions,
  ParticipantsPermissionOptions,
} from "raito";
import type { HTMLInputTypeAttribute, ReactElement } from "react";
import {
  Children,
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import Attachments from "src/components/documents/Attachments";
import { createHandleAttachment } from "src/components/wysiwyg/documents/createHandleAttachment";
import { createHandleThumbnail } from "src/components/wysiwyg/documents/createHandleThumbnail";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import TipTapByPermission from "src/components/wysiwyg/TipTapByPermission";
import { env } from "src/env/client.mjs";
import {
  dateToISOLikeButLocal,
  dateToISOLikeButLocalOrUndefined,
  dateToISOOrUndefined,
} from "src/lib/input_handling";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import ParticipantsList from "./ParticipantsList";
import EventsList from "./EventsList";

export interface FullDocumentData {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
  attachments: AttachmentsResponse[];
  upcomingEventDocuments: ListResult<
    EventDocumentsResponse<FullDocumentExpand>
  >;
  pastEventDocuments: ListResult<EventDocumentsResponse<FullDocumentExpand>>;
  allDocParticipants: ListResult<ParticipantsCustomResponse>;
  permission: ParticipantsPermissionOptions;
  people: PeopleResponse<unknown>[];
  user: UsersResponse<PeopleExpand>;
}

export interface FullDocumentProps<TRecord> extends FullDocumentData {
  childCollectionName: Collections;
  childId: string;
  pbClient: PBCustom;
  childrenDefaultValue?: TRecord;
  children?: ReactElement | ReactElement[];
  hasEvents?: boolean;
}

interface FullDocumentExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse<OwnerExpand>;
}

interface PeopleExpand {
  person: PeopleResponse;
}

interface OwnerExpand {
  owner: PeopleResponse;
}

export interface FullDocumentInput
  extends DocumentsRecord,
    FullDocumentsRecord {
  id: string;
  attachments: AttachmentsResponse[];
}

export interface FullDocumentChildProps<
  TFieldValues extends FieldValues = FieldValues
> extends Partial<UseFormReturn<TFieldValues>> {
  name: Path<TFieldValues>;
  type?: HTMLInputTypeAttribute;
  options?: RegisterOptions<TFieldValues>;
}

function FullDocument<TRecord>({
  childCollectionName,
  childId,
  fullDocument,
  attachments: initAttachments,
  upcomingEventDocuments,
  pastEventDocuments,
  allDocParticipants,
  permission,
  people,
  pbClient,
  user,
  children,
  childrenDefaultValue,
  hasEvents,
}: FullDocumentProps<TRecord>) {
  const baseDocument = fullDocument.expand?.document;
  const fullDocumentId = fullDocument.id;
  const documentId = fullDocument.document;
  const isWrite = permission == ParticipantsPermissionOptions.write;
  const router = useRouter();
  hasEvents ??= true;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
  } = useForm<FullDocumentInput>({
    defaultValues: {
      name: baseDocument?.name,
      thumbnail: undefined,
      priority: baseDocument?.priority,
      status: baseDocument?.status,
      richText: baseDocument?.richText,
      document: fullDocument.document,
      diffHash: baseDocument?.diffHash,
      attachmentsHash: baseDocument?.attachmentsHash,
      ...childrenDefaultValue,
    },
  });

  // Custom input field that is outside of the form
  const registerThumbnail = register("thumbnail", { disabled: !isWrite });
  const registerAttachments = register("attachments", { disabled: !isWrite });

  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [attachments, setAttachments] =
    useState<AttachmentsResponse[]>(initAttachments);

  const handleThumbnail = createHandleThumbnail(
    pbClient,
    documentId,
    setThumbnail
  );

  const handleAttachment = createHandleAttachment(
    pbClient,
    documentId,
    setAttachments
  );

  const onSubmit: SubmitHandler<FullDocumentInput> = useCallback(
    (inputData) => {
      // Hash for all DocumentsRecord fields
      const prevDiffHash = inputData.diffHash;
      const newDiffHash = MD5(
        SuperJSON.stringify({
          ...inputData,
          diffHash: undefined, // not included in hash, otherwise It would cause a recursion
        } as FullDocumentInput)
      ).toString();

      // Hash for attachments => Realtime subscription to only attachments to is related not the full attachments table
      const prevAttachmentsHash = inputData.attachmentsHash;
      const newAttachmentsHash = MD5(
        SuperJSON.stringify(attachments)
      ).toString();

      if (
        prevDiffHash != newDiffHash ||
        prevAttachmentsHash != newAttachmentsHash
      ) {
        setValue("diffHash", newDiffHash);

        // Send child submit update dynamically based on childrenDefaultValue
        const childBodyParams = Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          childrenDefaultValue as any
        ).reduce((prev, [key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let inputValue: string = (inputData as any)[key] ?? (value as string);

          // Matches the datetime format "2023-03-08T01:01" for input type "datetime-local"
          // To convert it into PocketBase local date time format
          if (inputValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/)) {
            inputValue = dateToISOOrUndefined(inputValue) ?? "";
          }
          return { ...prev, [key]: inputValue };
        }, {});

        pbClient
          .collection(childCollectionName)
          .update(childId, childBodyParams)
          .catch((err) => {
            if (env.NEXT_PUBLIC_DEBUG_MODE) console.error(err);
          });

        pbClient
          .collection(Collections.Documents)
          .update<DocumentsResponse>(documentId, {
            name: inputData.name,
            thumbnail: undefined,
            priority: inputData.priority,
            status: inputData.status,
            richText: inputData.richText,
            diffHash: newDiffHash,
            attachmentsHash: newAttachmentsHash,
          } as DocumentsRecord);

        if (env.NEXT_PUBLIC_DEBUG_MODE)
          console.log("Sending UPDATE requests...");
      }
    },
    [
      attachments,
      childCollectionName,
      childId,
      childrenDefaultValue,
      documentId,
      pbClient,
      setValue,
    ]
  );

  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useRef<HTMLInputElement>(null);

  const hasSaved = useSaveDoc({
    formRef,
    submitRef,
    watch,
    trigger,
  });

  // Realtime collaboration
  useEffect(() => {
    const unsubscribeFunc = pbClient
      .collection(Collections.Documents)
      .subscribe<DocumentsResponse>(documentId, async (data) => {
        // Send child submit update dynamically based on childrenDefaultValue
        const childRecord = await pbClient
          .collection(childCollectionName)
          .getOne(childId);

        const childBodyParams = Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          childrenDefaultValue as any
        ).reduce((prev, [key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let inputValue = (childRecord as any)[key] ?? (value as any);

          // Matches the datetime format "2023-03-29 09:06:00.000Z" for input type "datetime-local"
          // To convert it into PocketBase local date time format
          if (
            inputValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3}Z$/)
          ) {
            inputValue = dateToISOLikeButLocalOrUndefined(inputValue) ?? "";
          }
          return { ...prev, [key]: inputValue };
        }, {});

        reset({
          name: data.record.name,
          thumbnail: data.record.thumbnail,
          priority: data.record.priority,
          status: data.record.status,
          richText: data.record.richText,
          diffHash: data.record.diffHash,
          attachmentsHash: data.record.attachmentsHash,
          ...childBodyParams,
        });

        setThumbnail(data.record.thumbnail);

        const attachments = await pbClient
          .collection(Collections.Attachments)
          .getFullList<AttachmentsResponse>(200, {
            filter: `document = "${fullDocument.document}"`,
          });

        setAttachments(attachments);
      });

    return () => {
      unsubscribeFunc.then((func) => func());
      if (env.NEXT_PUBLIC_DEBUG_MODE)
        console.log("Successfully unsubscribe to documents collection");
    };
  }, [
    childCollectionName,
    childId,
    childrenDefaultValue,
    documentId,
    fullDocument.document,
    getValues,
    pbClient,
    reset,
  ]);

  // This css is currently duplicated with [personId].tsx page
  return (
    <>
      <div className="w-screen pb-6">
        {thumbnail && (
          <Image
            className="h-36 w-full xl:h-48"
            src={pbClient.buildUrl(
              `api/files/documents/${documentId}/${thumbnail}`
            )}
            alt="Uploaded image thumbnail"
            width={1700}
            height={192}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      {baseDocument?.deleted && (
        <h2 className="w-full rounded bg-red-200 p-2 font-bold">
          Document have been deleted on {baseDocument?.deleted}
        </h2>
      )}
      <header className="flex w-full items-start gap-x-4">
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
              className={`rounded-btn flex h-10 cursor-pointer items-center gap-1 bg-gray-200 p-2 font-semibold hover:bg-gray-300`}
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

        {isWrite && (
          <button
            className="flex h-10 items-center"
            onClick={() => {
              router.back();
              pbClient
                .collection(Collections.Documents)
                .update<DocumentsResponse>(documentId, {
                  deleted: dateToISOLikeButLocal(new Date()),
                } as DocumentsRecord);
            }}
          >
            <span className="material-symbols-rounded text-gray-500 [font-variation-settings:'FILL'_1] hover:text-red-400">
              delete
            </span>
          </button>
        )}
      </header>
      <section className="w-full xl:grid xl:grid-cols-[1fr_2fr] xl:gap-4">
        <div className="my-4 flex h-fit flex-col gap-4 rounded-lg bg-white px-6 py-5">
          {hasEvents && (
            <section>
              <EventsList
                fullDocumentId={fullDocumentId}
                upcomingEventDocuments={upcomingEventDocuments}
                pastEventDocuments={pastEventDocuments}
                disabled={!isWrite}
              ></EventsList>
            </section>
          )}

          <section>
            <h2 className="pb-3 text-xl font-semibold text-gray-700">
              Participants
            </h2>
            <ParticipantsList
              defaultValue={allDocParticipants}
              docId={documentId}
              people={people}
              owner={baseDocument?.expand?.owner as PeopleResponse}
              user={user}
              pbClient={pbClient}
              disabled={!isWrite}
            ></ParticipantsList>
          </section>
        </div>

        <form
          className="my-4 grid h-fit w-full grid-cols-[minmax(15rem,1fr)_minmax(0,2fr)] gap-4 rounded-lg bg-white px-6 py-5"
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="py-2" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className={`select-bordered select`}
            {...register("priority", { required: true, disabled: !isWrite })}
          >
            {Object.entries(DocumentsPriorityOptions).map(([stringValue]) => (
              <option key={stringValue} value={stringValue}>
                {stringValue}
              </option>
            ))}
          </select>
          <label className="py-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className={`select-bordered select`}
            {...register("status", { required: true, disabled: !isWrite })}
          >
            {Object.entries(DocumentsStatusOptions).map(([stringValue]) => (
              <option key={stringValue} value={stringValue}>
                {stringValue}
              </option>
            ))}
          </select>
          <label className="py-2" htmlFor="attachments">
            Attachments
          </label>
          <label
            htmlFor="attachments"
            className={`rounded-btn flex h-12 items-center gap-1 border border-gray-300 px-2 font-semibold hover:bg-gray-50 ${
              isWrite ? "cursor-pointer" : "bg-gray-50 text-gray-500"
            }`}
          >
            <span className="material-symbols-rounded">attach_file_add</span>
            <span>Add attachments</span>
          </label>
          <input
            {...registerAttachments}
            id="attachments"
            className={`hidden`}
            type="file"
            multiple={true}
            onChange={(e) => {
              registerAttachments.onChange(e);
              handleAttachment(e);
            }}
            disabled={!isWrite}
          />
          <Attachments
            attachments={attachments}
            setAttachments={setAttachments}
            pbClient={pbClient}
            disabled={!isWrite}
          ></Attachments>
          {children &&
            Children.map(children, (child) => {
              return child?.props.name
                ? createElement(child.type, {
                    ...{
                      ...child.props,
                      options: { disabled: !isWrite, ...child?.props.options },
                      register,
                      setValue,
                      key: child.props.name,
                    },
                  })
                : child;
            })}
          <label className="py-2" htmlFor="richText">
            Note
          </label>
          <div className="rounded-btn h-fit resize-y overflow-auto border-2 px-2 py-2 focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2">
            <Controller
              name="richText"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TipTapByPermission
                  id="richText"
                  richText={value ?? "{}"}
                  user={user}
                  permission={permission}
                  documentId={documentId}
                  pbClient={pbClient}
                  onChange={onChange}
                  setAttachments={setAttachments}
                ></TipTapByPermission>
              )}
            />
          </div>
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
            ref={submitRef}
            className={`rounded bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-400 ${
              hasSaved && "bg-gray-300 hover:bg-gray-300"
            }`}
            type="submit"
            disabled={permission == ParticipantsPermissionOptions.read}
            value="Save"
          />
        </form>
      </section>
    </>
  );
}

export type FetchFullDocumentDataFunc = (
  pbServer: PBCustom,
  user: UsersResponse<unknown>,
  fullDocId: string
) => Promise<FullDocumentData>;

export const fetchFullDocumentData: FetchFullDocumentDataFunc = async (
  pbServer,
  user,
  fullDocId
) => {
  const userPerson = await pbServer
    .collection(Collections.Users)
    .getOne<UsersResponse<PeopleExpand>>(user.id, { expand: "person" });

  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .getOne<FullDocumentsResponse<DocumentsExpand>>(fullDocId, {
      expand: "document.owner",
    });

  const document = fullDocument.expand?.document;

  const attachments = await pbServer
    .collection(Collections.Attachments)
    .getFullList<AttachmentsResponse>(200, {
      filter: `document = "${fullDocument.document}"`,
    });

  const nowISO = new Date().toISOString().replace("T", " ");

  const upcomingEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<FullDocumentExpand>>(undefined, undefined, {
      filter: `fullDocument.document.deleted = "" && toFullDocument = "${fullDocId}" && (endTime >= "${nowISO}" || recurring != "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "startTime",
    });

  const pastEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<FullDocumentExpand>>(undefined, undefined, {
      filter: `fullDocument.document.deleted = "" && toFullDocument = "${fullDocId}" && (endTime < "${nowISO}" && recurring = "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "-startTime",
    });

  const allDocParticipants =
    await pbServer.apiGetList<ParticipantsCustomResponse>(
      `/api/user/getAllDocParticipants/${document?.id}?fullList=true`
    );

  let permission: ParticipantsPermissionOptions | undefined;
  if (document?.deleted) {
    permission = ParticipantsPermissionOptions.read;
  } else if (document?.owner == user.person) {
    permission = ParticipantsPermissionOptions.write;
  } else {
    const participant = allDocParticipants.items.find(
      (allDocParticipant) => allDocParticipant.id == user.person
    );

    permission =
      (participant?.expand.participant_permission as
        | ParticipantsPermissionOptions
        | undefined) ?? ParticipantsPermissionOptions.read;
  }

  const people = await pbServer
    .collection(Collections.People)
    .getFullList<PeopleResponse>();

  return {
    fullDocument,
    attachments,
    upcomingEventDocuments,
    pastEventDocuments,
    allDocParticipants,
    permission,
    people,
    user: userPerson,
  };
};

export default FullDocument;
