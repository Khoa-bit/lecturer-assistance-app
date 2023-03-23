import { MD5 } from "crypto-js";
import Image from "next/image";
import Link from "next/link";
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
import type { ReactElement } from "react";
import { Children, createElement, useCallback, useRef, useState } from "react";
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
import type { RichText } from "src/types/documents";
import type { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";
import NewParticipantForm from "../../components/documents/NewParticipant";

export interface FullDocumentData {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
  attachments: AttachmentsResponse[];
  upcomingEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  pastEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  allDocParticipants: ListResult<ParticipantsCustomResponse>;
  permission: ParticipantsPermissionOptions;
  people: PeopleResponse<unknown>[];
}

export interface FullDocumentProps<TRecord> extends FullDocumentData {
  pbClient: PBCustom;
  user: UsersResponse<unknown>;
  childInputOnSubmit?: (inputData: TRecord) => Promise<TRecord>;
  childrenDefaultValue?: TRecord;
  children?: ReactElement | ReactElement[];
}

interface DocumentsExpand {
  document: DocumentsResponse<RichText>;
}

export interface FullDocumentInput
  extends DocumentsRecord<RichText>,
    FullDocumentsRecord {
  id: string;
  attachments: AttachmentsResponse[];
}

export interface FullDocumentChildProps<
  TFieldValues extends FieldValues = FieldValues
> extends Partial<UseFormReturn<TFieldValues>> {
  name: Path<TFieldValues>;
  options?: RegisterOptions<TFieldValues>;
}

function FullDocument<TRecord>({
  fullDocument,
  attachments: initAttachments,
  upcomingEventDocuments,
  pastEventDocuments,
  allDocParticipants,
  permission,
  people,
  childInputOnSubmit,
  pbClient,
  user,
  children,
  childrenDefaultValue,
}: FullDocumentProps<TRecord>) {
  const baseDocument = fullDocument.expand?.document;
  const fullDocumentId = fullDocument.id;
  const documentId = fullDocument.document;
  const isWrite = permission == ParticipantsPermissionOptions.write;

  const { register, control, handleSubmit, watch, setValue } =
    useForm<FullDocumentInput>({
      defaultValues: {
        name: baseDocument?.name,
        thumbnail: undefined,
        priority: baseDocument?.priority,
        status: baseDocument?.status,
        richText: baseDocument?.richText as object,
        document: fullDocument.document,
        diffHash: baseDocument?.diffHash,
        ...childrenDefaultValue,
      },
    });
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [attachments, setAttachments] =
    useState<AttachmentsResponse[]>(initAttachments);

  const onSubmit: SubmitHandler<FullDocumentInput> = useCallback(
    (inputData) => {
      const prevDiffHash = inputData.diffHash;
      const newDiffHash = MD5(
        SuperJSON.stringify({
          ...inputData,
          thumbnail: undefined, // not included in hash
          diffHash: undefined,
        } as FullDocumentInput)
      ).toString();

      if (prevDiffHash != newDiffHash) {
        setValue("diffHash", newDiffHash);
        if (childInputOnSubmit) childInputOnSubmit(inputData as TRecord);

        pbClient
          .collection(Collections.FullDocuments)
          .update<FullDocumentsResponse>(fullDocumentId, {
            document: inputData.document,
          } as FullDocumentsRecord);

        pbClient
          .collection(Collections.Documents)
          .update<DocumentsResponse>(documentId, {
            name: inputData.name,
            thumbnail: undefined,
            priority: inputData.priority,
            status: inputData.status,
            richText: inputData.richText,
            diffHash: newDiffHash,
          } as DocumentsRecord);
      }
    },
    [childInputOnSubmit, documentId, fullDocumentId, pbClient, setValue]
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

  return (
    <>
      <h2>Participants</h2>
      <NewParticipantForm
        defaultValue={allDocParticipants}
        docId={documentId}
        people={people}
        user={user}
        pbClient={pbClient}
        disabled={!isWrite}
      ></NewParticipantForm>
      <p key="newEvent">
        <Link href={`/eventDocuments/new?fullDocId=${fullDocumentId}`}>
          New event
        </Link>
      </p>
      <p>Upcoming</p>
      <ol>
        {upcomingEventDocuments.items.map((eventDocument) => (
          <li key={eventDocument.id}>
            <Link
              href={`/eventDocuments/${encodeURIComponent(eventDocument.id)}`}
            >
              {`${eventDocument.expand?.document.status} - ${eventDocument.expand?.document.name} - ${eventDocument.startTime} - ${eventDocument.endTime} - ${eventDocument.recurring}`}
            </Link>
          </li>
        ))}
      </ol>
      <p>Past</p>
      <ol>
        {pastEventDocuments.items.map((eventDocument) => (
          <li key={eventDocument.id}>
            <Link
              href={`/eventDocuments/${encodeURIComponent(eventDocument.id)}`}
            >
              {`${eventDocument.expand?.document.status} - ${eventDocument.expand?.document.name} - ${eventDocument.startTime} - ${eventDocument.endTime} - ${eventDocument.recurring}`}
            </Link>
          </li>
        ))}
      </ol>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true, disabled: !isWrite })} />
        <label htmlFor="thumbnail">Choose file to upload</label>
        <input
          id="thumbnail"
          type="file"
          {...register("thumbnail", { disabled: !isWrite })}
          onChange={handleThumbnail}
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
          id="attachments"
          type="file"
          multiple={true}
          onChange={handleAttachment}
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
              richText={value as RichText}
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
    .getList<EventDocumentsResponse<DocumentsExpand>>(undefined, undefined, {
      filter: `fullDocument = "${fullDocId}" && (startTime >= "${nowISO}" || recurring != "${EventDocumentsRecurringOptions.Once}")`,
      expand: "document",
      sort: "startTime",
    });

  const pastEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<DocumentsExpand>>(undefined, undefined, {
      filter: `fullDocument = "${fullDocId}" && (startTime < "${nowISO}" && recurring = "${EventDocumentsRecurringOptions.Once}")`,
      expand: "document",
      sort: "-startTime",
    });

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
