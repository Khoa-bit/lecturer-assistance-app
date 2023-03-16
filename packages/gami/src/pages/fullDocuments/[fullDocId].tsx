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
} from "raito";
import {
  Collections,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  EventDocumentsRecurringOptions,
} from "raito";
import { useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import Attachments from "src/components/documents/Attachments";
import MainLayout from "src/components/layouts/MainLayout";
import { createHandleAttachment } from "src/components/wysiwyg/documents/createHandleAttachment";
import { createHandleThumbnail } from "src/components/wysiwyg/documents/createHandleThumbnail";
import { useSaveDoc } from "src/components/wysiwyg/documents/useSaveDoc";
import TipTap, { Permission } from "src/components/wysiwyg/TipTap";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
  attachments: AttachmentsResponse[];
  upcomingEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  pastEventDocuments: ListResult<EventDocumentsResponse<DocumentsExpand>>;
  pbAuthCookie: string;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

interface FullDocumentInput extends DocumentsRecord, FullDocumentsRecord {
  id: string;
  attachments: AttachmentsResponse[];
}

function Document({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const fullDocument = dataParse.fullDocument;
  const baseDocument = dataParse.fullDocument.expand?.document;
  const fullDocumentId = fullDocument.id;
  const documentId = fullDocument.document;
  const upcomingEventDocuments = dataParse.upcomingEventDocuments;
  const pastEventDocuments = dataParse.pastEventDocuments;

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

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);

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

  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
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
        <input {...register("name", { required: true })} />
        <label htmlFor="thumbnail">Choose file to upload</label>
        <input
          id="thumbnail"
          type="file"
          {...register("thumbnail")}
          onChange={handleThumbnail}
        />
        <select {...register("priority", { required: true })}>
          {Object.entries(DocumentsPriorityOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <select {...register("status", { required: true })}>
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
        />
        <Controller
          name="richText"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TipTap
              onChange={onChange}
              value={value as { json: object }}
              documentId={documentId}
              pbClient={pbClient}
              user={user}
              permission={Permission.edit}
              setCurAttachments={setAttachments}
            ></TipTap>
          )}
        />
        <input type="submit" />
      </form>
      <Attachments
        attachments={attachments}
        setAttachments={setAttachments}
        pbClient={pbClient}
      ></Attachments>
      {thumbnail && (
        <Image
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
  const { pbServer } = await getPBServer(req, resolvedUrl);
  const fullDocId = query.fullDocId as string;

  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .getOne<FullDocumentsResponse>(fullDocId, {
      expand: "document",
    });

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

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocument,
        attachments,
        upcomingEventDocuments,
        pastEventDocuments,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

Document.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Document;
