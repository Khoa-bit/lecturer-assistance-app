import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import type { ListResult } from "pocketbase";
import type {
  AttachmentsResponse,
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsRecord,
  EventDocumentsResponse,
  FullDocumentsCustomResponse,
  ParticipantsResponse,
  PeopleResponse,
} from "raito";
import {
  Collections,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  EventDocumentsRecurringOptions,
  ParticipantsPermissionOptions,
} from "raito";
import { useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import Attachments from "src/components/documents/Attachments";
import MainLayout from "src/components/layouts/MainLayout";
import { createHandleAttachment } from "src/components/wysiwyg/documents/createHandleAttachment";
import { createHandleThumbnail } from "src/components/wysiwyg/documents/createHandleThumbnail";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import TipTapByPermission from "src/components/wysiwyg/TipTapByPermission";
import { getOwnerRole } from "src/lib/documents";
import {
  dateToISOLikeButLocalOrUndefined,
  dateToISOOrUndefined,
} from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import type { RichText } from "src/types/documents";
import SuperJSON from "superjson";

interface EventDocumentData {
  eventDocument: EventDocumentsResponse<DocumentsExpand>;
  fullDocuments: ListResult<FullDocumentsCustomResponse>;
  attachments: AttachmentsResponse[];
  participants: ParticipantsResponse<PeopleExpand>[];
  userRole: ParticipantsResponse<PeopleExpand | unknown>;
  pbAuthCookie: string;
}

interface DocumentsExpand {
  document: DocumentsResponse<RichText>;
}

interface PeopleExpand {
  person: PeopleResponse;
}

interface EventDocumentInput
  extends DocumentsRecord<RichText>,
    EventDocumentsRecord {
  attachments: AttachmentsResponse[];
}

function EventDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<EventDocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const eventDocument = dataParse.eventDocument;
  const fullDocuments = dataParse.fullDocuments;
  const baseDocument = dataParse.eventDocument.expand?.document;
  const eventDocumentId = eventDocument.id;
  const documentId = eventDocument.document;
  const participants = dataParse.participants;
  const userRole = dataParse.userRole;
  const permission =
    user.person == baseDocument?.owner
      ? ParticipantsPermissionOptions.write
      : userRole.permission;
  const isWrite = permission == ParticipantsPermissionOptions.write;

  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [attachments, setAttachments] = useState<AttachmentsResponse[]>(
    dataParse.attachments
  );

  const { register, control, handleSubmit, watch, setValue, trigger } =
    useForm<EventDocumentInput>({
      defaultValues: {
        name: baseDocument?.name,
        priority: baseDocument?.priority,
        status: baseDocument?.status,
        richText: baseDocument?.richText,
        document: eventDocument.document,
        diffHash: baseDocument?.diffHash,
        fullDocument: eventDocument.fullDocument,
        attachments: undefined,
        owner: undefined,
        startTime: dateToISOLikeButLocalOrUndefined(eventDocument.startTime),
        endTime: dateToISOLikeButLocalOrUndefined(eventDocument.endTime),
        recurring: eventDocument.recurring,
      },
    });

  const onSubmit: SubmitHandler<EventDocumentInput> = useCallback(
    (inputData) => {
      const prevDiffHash = inputData.diffHash;
      const newDiffHash = MD5(
        SuperJSON.stringify({
          ...inputData,
          thumbnail: undefined, // not included in hash
          diffHash: undefined,
        } as EventDocumentInput)
      ).toString();

      if (prevDiffHash != newDiffHash) {
        setValue("diffHash", newDiffHash);
        pbClient
          .collection(Collections.EventDocuments)
          .update<EventDocumentsResponse>(eventDocumentId, {
            document: inputData.document,
            startTime: dateToISOOrUndefined(inputData.startTime),
            endTime: dateToISOOrUndefined(inputData.endTime),
            recurring: inputData.recurring,
            fullDocument: inputData.fullDocument,
          } as EventDocumentsRecord);

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
    [documentId, eventDocumentId, pbClient, setValue]
  );

  useSaveDoc({
    trigger,
    submit: handleSubmit(onSubmit),
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

  const participantsList = participants.map((participant) => (
    <li key={participant.id}>
      {participant.expand?.person.name} - {participant.permission} -{" "}
      {participant.role} - {participant.note}
    </li>
  )) ?? <p>{"Error when fetching participantsList :<"}</p>;

  return (
    <>
      <Head>
        <title>Event Document</title>
      </Head>
      <h1>Event Document</h1>
      <h2>Participants</h2>
      <ol>{participantsList}</ol>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <input
          type="datetime-local"
          {...register("startTime", {
            required: true,
            disabled: !isWrite,
          })}
        />
        <input
          type="datetime-local"
          {...register("endTime", { disabled: !isWrite })}
        />
        <select {...register("recurring", { disabled: !isWrite })}>
          {Object.entries(EventDocumentsRecurringOptions).map(
            ([stringValue]) => (
              <option key={stringValue} value={stringValue}>
                {stringValue}
              </option>
            )
          )}
        </select>
        <select {...register("fullDocument", { disabled: !isWrite })}>
          <option key="None" value="">
            None
          </option>
          {fullDocuments.items.map((fullDoc) => (
            <option key={fullDoc.id} value={fullDoc.id}>
              {fullDoc.expand?.userDocument_name}
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

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer, user } = await getPBServer(req, resolvedUrl);
  const eventDocId = query.eventDocId as string;

  const eventDocument = await pbServer
    .collection(Collections.EventDocuments)
    .getOne<EventDocumentsResponse<DocumentsExpand>>(eventDocId, {
      expand: "document",
    });

  const fullDocuments = await pbServer.apiGetList<FullDocumentsCustomResponse>(
    "/api/user/fullDocuments"
  );

  const attachments = await pbServer
    .collection(Collections.Attachments)
    .getFullList<AttachmentsResponse>(200, {
      filter: `document = "${eventDocument.document}"`,
    });

  const participants = await pbServer
    .collection(Collections.Participants)
    .getFullList<ParticipantsResponse<PeopleExpand>>({
      filter: `document = "${eventDocument.document}"`,
      expand: "person",
    });

  let userRole = participants.find(
    (participant) => participant.person == user.person
  ) as ParticipantsResponse<PeopleExpand | unknown>;

  if (!userRole && eventDocument.expand?.document.owner != user.person) {
    return {
      redirect: {
        destination: "/eventDocuments",
        permanent: false,
      },
    };
  }

  // Default permission for owner
  userRole ??= getOwnerRole(eventDocument.document, user.person);

  return {
    props: {
      data: SuperJSON.stringify({
        eventDocument,
        attachments,
        fullDocuments,
        participants,
        userRole,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as EventDocumentData),
    },
  };
};

EventDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocument;
