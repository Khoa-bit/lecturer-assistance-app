import { MD5 } from "crypto-js";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Image from "next/image";
import type {
  DocumentsRecord,
  DocumentsResponse,
  FullDocumentsRecord,
  FullDocumentsResponse,
} from "raito";
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
import { usePBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocument: FullDocumentsResponse<FullDocumentExpand>;
  pbAuthCookie: string;
}

interface FullDocumentExpand {
  document: DocumentsResponse;
}

type FullDocumentInput = DocumentsRecord & FullDocumentsRecord & { id: string };

function Document({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const fullDocument = dataParse.fullDocument;
  const baseDocument = dataParse.fullDocument.expand?.document;
  const fullDocumentId = fullDocument.id;
  const documentId = fullDocument.document;

  const { register, control, handleSubmit, watch, setValue } =
    useForm<FullDocumentInput>({
      defaultValues: {
        name: baseDocument?.name,
        // thumbnail: baseDocument?.thumbnail,
        category: fullDocument.category,
        priority: baseDocument?.priority,
        status: baseDocument?.status,
        richText: baseDocument?.richText as object,
        document: fullDocument.document,
        diffHash: baseDocument?.diffHash,
      },
    });
  const [curFile, setCurFile] = useState<File>();

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);
  let thumbnailUrl: string | undefined;
  if (baseDocument?.thumbnail) {
    thumbnailUrl = pbClient.buildUrl(
      `api/files/documents/${documentId}/${baseDocument.thumbnail}`
    );
    console.log(thumbnailUrl);
  }

  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit: SubmitHandler<FullDocumentInput> = useCallback(
    (inputData) => {
      const prevDiffHash = inputData.diffHash;
      const newDiffHash = MD5(
        SuperJSON.stringify({
          ...inputData,
          thumbnail: undefined,
          diffHash: undefined,
        } as FullDocumentInput)
      ).toString();

      if (prevDiffHash != newDiffHash) {
        console.log("Saving document...");
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
            // thumbnail: inputData.thumbnail,
            priority: inputData.priority,
            status: inputData.status,
            richText: inputData.richText,
            diffHash: newDiffHash,
          } as DocumentsRecord);
      }
    },
    [documentId, fullDocumentId, pbClient, setValue]
  );

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

  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.item(0);
                  if (!file) return;

                  onChange({
                    target: { value: file, name },
                  });

                  const formData = new FormData();
                  formData.append("thumbnail", file);
                  pbClient
                    .collection(Collections.Documents)
                    .update<DocumentsResponse>(documentId, formData);

                  setCurFile(file);
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
          name="richText"
          control={control}
          render={({ field: { name, onChange, value } }) => (
            <TipTap
              name={name}
              onChange={onChange}
              value={value as { json: object }}
            ></TipTap>
          )}
        />
        <input type="submit" />
      </form>
      {curFile && (
        <Image
          key={"File Thumbnail key"}
          src={URL.createObjectURL(curFile)}
          alt="Uploaded image thumbnail"
          width={500}
          height={500}
        />
      )}
      {!curFile && thumbnailUrl && (
        <Image
          key={"File Thumbnail key"}
          src={thumbnailUrl}
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
  res,
  query,
}: GetServerSidePropsContext) => {
  const { pbServer } = await usePBServer(req, res);
  const fullDocId = query.fullDocId as string;

  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .getOne<FullDocumentsResponse>(fullDocId, {
      expand: "document",
    });

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocument,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      }),
    },
  };
};

Document.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Document;
