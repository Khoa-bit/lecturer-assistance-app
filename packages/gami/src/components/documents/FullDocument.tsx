import { MD5 } from "crypto-js";
import Image from "next/image";
import { useRouter } from "next/router";
import type { ListResult } from "pocketbase";
import type {
  AttachmentsResponse,
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
  ParticipantsCustomResponse,
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
} from "src/lib/input_handling";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import NewParticipantForm from "../../components/documents/NewParticipant";
import EventsList from "./Events";

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
}

export interface FullDocumentProps<TRecord> extends FullDocumentData {
  childCollectionName: Collections;
  childId: string;
  pbClient: PBCustom;
  user: UsersResponse<unknown>;
  childrenDefaultValue?: TRecord;
  children?: ReactElement | ReactElement[];
  hasEvents?: boolean;
}

interface FullDocumentExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
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
  const isWrite =
    permission == ParticipantsPermissionOptions.write && !baseDocument?.deleted;
  const router = useRouter();
  hasEvents ??= true;

  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<FullDocumentInput>({
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

  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [attachments, setAttachments] =
    useState<AttachmentsResponse[]>(initAttachments);

  // Custom input field that is outside of the form
  const registerThumbnail = register("thumbnail", { disabled: !isWrite });
  const registerAttachments = register("attachments", { disabled: !isWrite });

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
          if (inputValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
            inputValue = dateToISOLikeButLocalOrUndefined(inputValue) ?? "";
          }
          return { ...prev, [key]: inputValue };
        }, {});

        pbClient
          .collection(childCollectionName)
          .update(childId, childBodyParams)
          .then((val) => {
            console.log(val);
          })
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

  useSaveDoc({
    formRef,
    submitRef,
    watch,
  });

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

  // Realtime collaboration
  useEffect(() => {
    const unsubscribeFunc = pbClient
      .collection(Collections.Documents)
      .subscribe<DocumentsResponse>(documentId, async (data) => {
        reset({
          name: data.record.name,
          thumbnail: data.record.thumbnail,
          priority: data.record.priority,
          status: data.record.status,
          richText: data.record.richText,
          diffHash: data.record.diffHash,
          attachmentsHash: data.record.attachmentsHash,
        });

        setThumbnail(data.record.thumbnail);

        const attachments = await pbClient
          .collection(Collections.Attachments)
          .getFullList<AttachmentsResponse>(200, {
            filter: `document = "${fullDocument.document}"`,
          });

        setAttachments(attachments);
      });

    // Send child submit update dynamically based on childrenDefaultValue
    const childUnsubscribeFunc = pbClient
      .collection(childCollectionName)
      .subscribe(childId, (data) => {
        const childBodyParams = Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          childrenDefaultValue as any
        ).reduce((prev, [key, value]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const inputValue = (data as any).record[key] ?? value;
          return { ...prev, [key]: inputValue };
        }, {});

        reset(childBodyParams);
      });

    return () => {
      setTimeout(async () => {
        await unsubscribeFunc.then((func) => func());
        if (env.NEXT_PUBLIC_DEBUG_MODE)
          console.log("Successfully unsubscribe to documents collection");

        await childUnsubscribeFunc.then((func) => func());
        if (env.NEXT_PUBLIC_DEBUG_MODE)
          console.log(
            `Successfully unsubscribe to ${childCollectionName} collection`
          );
      }, 0);
    };
  }, [
    childCollectionName,
    childId,
    childrenDefaultValue,
    documentId,
    fullDocument.document,
    pbClient,
    reset,
  ]);

  return (
    <>
      {baseDocument?.deleted && (
        <h2>Document have been deleted on {baseDocument?.deleted}</h2>
      )}
      <h2>Participants</h2>
      {isWrite && (
        <button
          onClick={() => {
            router.replace(router.pathname.replace(/\/[^\/]+$/, ""));
            pbClient
              .collection(Collections.Documents)
              .update<DocumentsResponse>(documentId, {
                deleted: dateToISOLikeButLocal(new Date()),
              } as DocumentsRecord);
          }}
        >
          Delete
        </button>
      )}
      <NewParticipantForm
        defaultValue={allDocParticipants}
        docId={documentId}
        people={people}
        user={user}
        pbClient={pbClient}
        disabled={!isWrite}
      ></NewParticipantForm>
      {hasEvents && (
        <EventsList
          fullDocumentId={fullDocumentId}
          upcomingEventDocuments={upcomingEventDocuments}
          pastEventDocuments={pastEventDocuments}
          isWrite={isWrite}
        ></EventsList>
      )}
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true, disabled: !isWrite })} />
        <label htmlFor="thumbnail">Choose file to upload</label>
        <input
          id="thumbnail"
          type="file"
          {...registerThumbnail}
          onChange={(e) => {
            registerThumbnail.onChange(e);
            handleThumbnail(e);
          }}
        />
        <select
          {...register("priority", { required: true, disabled: !isWrite })}
        >
          {Object.entries(DocumentsPriorityOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <select {...register("status", { required: true, disabled: !isWrite })}>
          {Object.entries(DocumentsStatusOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <label htmlFor="attachments">Choose attachments</label>
        <input
          {...registerAttachments}
          id="attachments"
          type="file"
          multiple={true}
          onChange={(e) => {
            registerAttachments.onChange(e);
            handleAttachment(e);
          }}
          disabled={!isWrite}
        />
        {children &&
          Children.map(children, (child) => {
            return child?.props.name
              ? createElement(child.type, {
                  ...{
                    ...child.props,
                    options: { ...child?.props.options, disabled: !isWrite },
                    register,
                    setValue,
                    key: child.props.name,
                  },
                })
              : child;
          })}
        <Controller
          name="richText"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TipTapByPermission
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
        <input
          ref={submitRef}
          type="submit"
          disabled={permission == ParticipantsPermissionOptions.read}
        />
      </form>
      <Attachments
        attachments={attachments}
        setAttachments={setAttachments}
        pbClient={pbClient}
      ></Attachments>
      {thumbnail && (
        <Image
          id={thumbnail}
          src={pbClient.buildUrl(
            `api/files/documents/${documentId}/${thumbnail}`
          )}
          alt="Uploaded image thumbnail"
          width={500}
          height={500}
        />
      )}
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
  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .getOne<FullDocumentsResponse<DocumentsExpand>>(fullDocId, {
      expand: "document",
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
      filter: `fullDocument = "${fullDocId}" && (startTime >= "${nowISO}" || recurring != "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "startTime",
    });

  const pastEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<FullDocumentExpand>>(undefined, undefined, {
      filter: `fullDocument = "${fullDocId}" && (startTime < "${nowISO}" && recurring = "${EventDocumentsRecurringOptions.Once}")`,
      expand: "fullDocument.document",
      sort: "-startTime",
    });

  console.log(upcomingEventDocuments, pastEventDocuments);

  const allDocParticipants =
    await pbServer.apiGetList<ParticipantsCustomResponse>(
      `/api/user/getAllDocParticipants/${document?.id}?fullList=true`
    );

  let permission: ParticipantsPermissionOptions | undefined;
  if (document?.owner == user.person) {
    permission = ParticipantsPermissionOptions.write;
  } else {
    const participant = allDocParticipants.items.find(
      (allDocParticipant) => allDocParticipant.id == user.person
    );

    const documentsWithPermission =
      participant?.expand.userDocument_id_list.map((documentId, index) => {
        return {
          documentId,
          permission: participant?.expand.participant_permission_list.at(
            index
          ) as ParticipantsPermissionOptions | undefined,
        };
      });

    permission =
      documentsWithPermission?.find(
        (documentWithPermission) =>
          documentWithPermission.documentId == document?.id
      )?.permission ?? ParticipantsPermissionOptions.read;
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
  };
};

export default FullDocument;
