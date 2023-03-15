import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { ListResult } from "pocketbase";
import type {
  AttachmentsResponse,
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsRecord,
  EventDocumentsResponse,
  FullDocumentsCustomResponse,
} from "raito";
import {
  Collections,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  EventDocumentsRecurringOptions,
} from "raito";
import { ChangeEvent, Dispatch, SetStateAction, useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import Attachments from "src/components/documents/Attachments";
import MainLayout from "src/components/layouts/MainLayout";
import TipTap, { Permission } from "src/components/wysiwyg/TipTap";
import { createHandleAttachment } from "src/lib/documents/createHandleAttachment";
import { createHandleThumbnail } from "src/lib/documents/createHandleThumbnail";
import { useSaveDoc } from "src/lib/documents/useSaveDoc";
import {
  dateToISOLikeButLocalOrUndefined,
  dateToISOOrUndefined,
  debounce,
} from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import { isFulfilled, isRejected } from "src/lib/promises/checkState";
import { PBCustom } from "src/types/pb-custom";
import SuperJSON from "superjson";

interface EventDocumentData {
  eventDocument: EventDocumentsResponse<DocumentsExpand>;
  fullDocuments: ListResult<FullDocumentsCustomResponse>;
  attachments: AttachmentsResponse[];
  pbAuthCookie: string;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

interface EventDocumentInput extends DocumentsRecord, EventDocumentsRecord {
  attachments: AttachmentsResponse[];
}

function EventDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<EventDocumentData>(data);

  const eventDocument = dataParse.eventDocument;
  const fullDocuments = dataParse.fullDocuments;
  const baseDocument = dataParse.eventDocument.expand?.document;
  const eventDocumentId = eventDocument.id;
  const documentId = eventDocument.document;

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);

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
        richText: baseDocument?.richText as object,
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

  return (
    <>
      <Head>
        <title>Event Document</title>
      </Head>
      <h1>Event Document</h1>
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
        <input
          type="datetime-local"
          {...register("startTime", {
            required: true,
          })}
        />
        <input type="datetime-local" {...register("endTime")} />
        <select {...register("recurring")}>
          {Object.entries(EventDocumentsRecurringOptions).map(
            ([stringValue]) => (
              <option key={stringValue} value={stringValue}>
                {stringValue}
              </option>
            )
          )}
        </select>
        <select {...register("fullDocument")}>
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
  const eventDocId = query.eventDocId as string;

  const eventDocument = await pbServer
    .collection(Collections.EventDocuments)
    .getOne<EventDocumentsResponse>(eventDocId, {
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

  return {
    props: {
      data: SuperJSON.stringify({
        eventDocument,
        attachments,
        fullDocuments,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as EventDocumentData),
    },
  };
};

EventDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocument;
