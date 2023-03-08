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
import { EventDocumentsRecurringOptions } from "raito";
import {
  Collections,
  DocumentsPriorityOptions,
  DocumentsStatusOptions,
  FullDocumentsCategoryOptions,
} from "raito";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import MainLayout from "src/components/layouts/MainLayout";
import TipTap from "src/components/wysiwyg/TipTap";
import { debounce } from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocument: FullDocumentsResponse<DocumentExpand>;
  attachments: AttachmentsResponse[];
  upcomingEventDocuments: ListResult<EventDocumentsResponse<DocumentExpand>>;
  pastEventDocuments: ListResult<EventDocumentsResponse<DocumentExpand>>;
  pbAuthCookie: string;
}

interface DocumentExpand {
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

  const { register, control, handleSubmit, watch, setValue } =
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
  const [curAttachments, setCurAttachments] = useState<AttachmentsResponse[]>(
    dataParse.attachments
  );

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);

  const formRef = useRef<HTMLFormElement>(null);
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

  const isRejected = (
    input: PromiseSettledResult<unknown>
  ): input is PromiseRejectedResult => input.status === "rejected";

  const isFulfilled = <T,>(
    input: PromiseSettledResult<T>
  ): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

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

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  useEffect(() => {
    const subscription = watch(() => debouncedSave());
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  const [imageURL, setImageURL] = useState<string | undefined>();
  const addImage = useCallback(async () => {
    const url = window.prompt("URL");

    if (url) {
      const imageRes = await fetch(url);

      const formData = new FormData();
      formData.append("file", await imageRes.blob());
      formData.append("document", "15ijp1695dlt2jd");

      const newImage = await pbClient
        .collection(Collections.Attachments)
        .create<AttachmentsResponse>(formData, {
          $autoCancel: false,
        });

      setImageURL(
        pbClient.buildUrl(
          `api/files/attachments/${newImage.id}/${newImage.file}`
        )
      );
    }
  }, [pbClient]);

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
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true })} />
        <Controller
          name="thumbnail"
          control={control}
          render={({ field: { name, onChange } }) => (
            <>
              <label htmlFor="file">Choose file to upload</label>
              <input
                id="file"
                type="file"
                name={name}
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.item(0);
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("thumbnail", file);

                  const thumbnailDoc = await pbClient
                    .collection(Collections.Documents)
                    .update<DocumentsResponse>(documentId, formData);
                  setThumbnail(thumbnailDoc.thumbnail);

                  onChange({
                    target: { value: thumbnailDoc.thumbnail, name },
                  });
                }}
              />
            </>
          )}
        />
        <select {...register("category")}>
          {Object.entries(FullDocumentsCategoryOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
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
        <Controller
          name="attachments"
          control={control}
          render={({ field: { name, onChange } }) => (
            <>
              <label htmlFor="file">Choose attachments</label>
              <input
                id="file"
                type="file"
                name={name}
                multiple={true}
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  const files = e.target.files;
                  if (!files) return;

                  const createPromises = Object.values(files).map(
                    async (file) => {
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("document", documentId);
                      return await pbClient
                        .collection(Collections.Attachments)
                        .create<AttachmentsResponse>(formData, {
                          $autoCancel: false,
                        });
                    }
                  );
                  const results = await Promise.allSettled<AttachmentsResponse>(
                    createPromises
                  );

                  const fulfilledValues = results
                    .filter(isFulfilled)
                    .map((p) => p.value);
                  const rejectedReasons = results
                    .filter(isRejected)
                    .map((p) => p.reason);

                  if (rejectedReasons.length) {
                    console.error(rejectedReasons);
                  }

                  setCurAttachments((curAttachments) => [
                    ...curAttachments,
                    ...fulfilledValues,
                  ]);

                  onChange({
                    target: { value: curAttachments, name },
                  });
                }}
              />
            </>
          )}
        />
        <Controller
          name="richText"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <TipTap
              name={name}
              onChange={onChange}
              value={value as { json: object }}
              documentId={documentId}
              pbClient={pbClient}
              user={user}
              setCurAttachments={setCurAttachments}
            ></TipTap>
          )}
        />
        <input type="submit" />
      </form>
      <ol>
        {curAttachments.map((attachment) => (
          <li key={attachment.id}>
            {attachment.file}{" "}
            <button
              onClick={() => {
                pbClient
                  .collection(Collections.Attachments)
                  .delete(attachment.id);

                setCurAttachments((curAttachments) =>
                  curAttachments.filter(
                    (curAttachment) => curAttachment.id != attachment.id
                  )
                );
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
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
      <button onClick={addImage}>Set Image</button>
      {imageURL && <Image src={imageURL} alt="" width={500} height={500} />}
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
    .getList<EventDocumentsResponse<DocumentExpand>>(undefined, undefined, {
      filter: `fullDocument = "${fullDocId}" && (startTime >= "${nowISO}" || recurring != "${EventDocumentsRecurringOptions.Once}")`,
      expand: "document",
      sort: "startTime",
    });

  const pastEventDocuments = await pbServer
    .collection(Collections.EventDocuments)
    .getList<EventDocumentsResponse<DocumentExpand>>(undefined, undefined, {
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
