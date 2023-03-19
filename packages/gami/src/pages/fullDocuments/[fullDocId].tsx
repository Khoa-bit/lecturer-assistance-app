import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
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
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import type { RichText } from "src/types/documents";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
  attachments: AttachmentsResponse[];
  upcomingEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  pastEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  allDocParticipants: ListResult<ParticipantsCustomResponse>;
  permission: ParticipantsPermissionOptions;
  pbAuthCookie: string;
}

interface DocumentsExpand {
  document: DocumentsResponse<RichText>;
}

interface FullDocumentInput
  extends DocumentsRecord<RichText>,
    FullDocumentsRecord {
  id: string;
  attachments: AttachmentsResponse[];
}

function Document({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const fullDocument = dataParse.fullDocument;
  const baseDocument = dataParse.fullDocument.expand?.document;
  const fullDocumentId = fullDocument.id;
  const documentId = fullDocument.document;
  const upcomingEventDocuments = dataParse.upcomingEventDocuments;
  const pastEventDocuments = dataParse.pastEventDocuments;
  const allDocParticipants = dataParse.allDocParticipants;
  const permission = dataParse.permission;
  const isWrite = permission == ParticipantsPermissionOptions.write;

  const { register, control, handleSubmit, watch, setValue, trigger } =
    useForm<FullDocumentInput>({
      defaultValues: {
        name: baseDocument?.name,
        thumbnail: undefined,
        category: fullDocument.category,
        priority: baseDocument?.priority,
        status: baseDocument?.status,
        richText: baseDocument?.richText as object,
        document: fullDocument.document,
        diffHash: baseDocument?.diffHash,
      },
    });
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [attachments, setAttachments] = useState<AttachmentsResponse[]>(
    dataParse.attachments
  );

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
        pbClient
          .collection(Collections.FullDocuments)
          .update<FullDocumentsResponse>(fullDocumentId, {
            category: inputData.category,
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
    [documentId, fullDocumentId, pbClient, setValue]
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

  const participantsList = allDocParticipants.items.map(
    (allDocParticipant, index) => (
      <li key={allDocParticipant.id}>
        <Link href={`/people/${encodeURIComponent(allDocParticipant.id)}`}>
          {allDocParticipant.name}
        </Link>
        {` - ${allDocParticipant.expand.participant_permission_list.at(index)}`}
      </li>
    )
  ) ?? <p>{"Error when fetching participantsList :<"}</p>;
  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
      <h2>Participants</h2>
      <ol>{participantsList}</ol>
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
  const fullDocId = query.fullDocId as string;

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

    permission = documentsWithPermission?.find(
      (documentWithPermission) =>
        documentWithPermission.documentId == document?.id
    )?.permission;
  }

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocument,
        attachments,
        upcomingEventDocuments,
        pastEventDocuments,
        allDocParticipants,
        permission,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Document.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Document;
