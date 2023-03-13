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
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import MainLayout from "src/components/layouts/MainLayout";
import TipTap from "src/components/wysiwyg/TipTap";
import {
  dateToISOLikeButLocalOrUndefined,
  dateToISOOrUndefined,
  debounce,
} from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
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

  const { register, control, handleSubmit, watch, setValue, trigger } =
    useForm<EventDocumentInput>({
      defaultValues: {
        name: baseDocument?.name,
        thumbnail: undefined,
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
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    baseDocument?.thumbnail
  );
  const [curAttachments, setCurAttachments] = useState<AttachmentsResponse[]>(
    dataParse.attachments
  );

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);

  const [isSaved, setIsSaved] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
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
      setIsSaved(true);
    },
    [documentId, eventDocumentId, pbClient, setValue]
  );

  const router = useRouter();
  useEffect(() => {
    const warningText =
      "Do you want to leave the site? Changes you made is being saved...";
    const handleWindowClose = (e: Event) => {
      if (isSaved) return;
      e.preventDefault();
      return warningText;
    };
    const handleBrowseAway = () => {
      if (isSaved) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [isSaved, router.events]);

  const isRejected = (
    input: PromiseSettledResult<unknown>
  ): input is PromiseRejectedResult => input.status === "rejected";

  const isFulfilled = <T,>(
    input: PromiseSettledResult<T>
  ): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

  const submitForm = useCallback(
    () =>
      // Validate the form before manual submitting
      trigger(undefined, { shouldFocus: false }).then((isValid) => {
        if (isValid) {
          handleSubmit(onSubmit)();
        }
      }),
    [handleSubmit, onSubmit, trigger]
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

  useEffect(() => {
    let isFirst = true;
    const subscription = watch(() => {
      if (isFirst) {
        isFirst = false;
        return;
      }
      setIsSaved(false);
      debouncedSave();
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  return (
    <>
      <Head>
        <title>Event Document</title>
      </Head>
      <h1>Event Document</h1>
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
