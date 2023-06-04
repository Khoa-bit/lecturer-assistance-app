import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import Link from "next/link";
import type { ListResult } from "pocketbase";
import type {
  DocumentsRecord,
  DocumentsResponse,
  EventDocumentsRecord,
  EventDocumentsResponse,
  FullDocumentsCustomResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections } from "raito";
import { useEffect, useState } from "react";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import type {
  SelectOption,
  SelectProps,
} from "src/components/documents/Select";
import Select from "src/components/documents/Select";
import MainLayout from "src/components/layouts/MainLayout";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";
import { env } from "../../env/client.mjs";
import { dateToPb, pbToDate } from "../../lib/input_handling";

interface DocumentData {
  fullDocumentData: FullDocumentData;
  eventDocument: EventDocumentsResponse<FullDocumentsExpand>;
  toFullDocuments: ListResult<FullDocumentsCustomResponse>;
  pbAuthCookie: string;
}

const remindBeforeMinutes = 30;

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

function EventDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const eventDocument = dataParse.eventDocument;
  const baseDocument = eventDocument.expand?.fullDocument.expand?.document;
  const toFullDocuments = dataParse.toFullDocuments;
  const toFullDocumentsList = toFullDocuments.items.sort((a, b) =>
    a.expand.userDocument_name.localeCompare(b.expand.userDocument_name)
  );
  const [toFullDocument, setToFullDocument] = useState(
    eventDocument.toFullDocument
  );
  const fullDocumentData = dataParse.fullDocumentData;

  const isEventOwner = baseDocument?.owner === user.person;
  const childCollectionName = Collections.EventDocuments;
  const childId = eventDocument.id;

  const fullDocumentProps: FullDocumentProps<EventDocumentsRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    childrenDefaultValue: {
      fullDocument: eventDocument.fullDocument,
      recurring: eventDocument.recurring,
      toFullDocument: toFullDocument,
    },
    hasEvents: false,
  };

  const docLink = toFullDocumentsList.some(
    (fullDocument) => fullDocument.id == toFullDocument
  ) ? (
    <Link
      className="absolute right-10 h-6 bg-white"
      href={`/fullDocuments/${toFullDocument}`}
    >
      <span className="material-symbols-rounded text-gray-500 [font-variation-settings:'FILL'_1] hover:text-blue-500">
        link
      </span>
    </Link>
  ) : (
    <></>
  );

  useEffect(() => {
    if (!baseDocument?.id) return;

    const unsubscribeFunc = pbClient
      .collection(Collections.Documents)
      .subscribe<DocumentsRecord>(baseDocument.id, (data) => {
        if (!data.record.startTime) return;

        const startTime = pbToDate(data.record.startTime);
        startTime.setMinutes(startTime.getMinutes() - remindBeforeMinutes);

        console.log("... Trying to update reminder ...", eventDocument.id);

        pbClient
          .collection(Collections.EventDocuments)
          .update<EventDocumentsRecord>(eventDocument.id, {
            reminderAt: dateToPb(startTime),
          } as EventDocumentsRecord)
          .then(() => {
            console.log(">>> Successfully update reminder", eventDocument.id);
          });
      });

    return () => {
      unsubscribeFunc.then((func) => func());
      if (env.NEXT_PUBLIC_DEBUG_MODE)
        console.log("Successfully unsubscribe to documents collection");
    };
  }, [baseDocument?.id, eventDocument.id, pbClient]);
  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col items-center px-4">
      <Head>
        <title>Event Document</title>
      </Head>
      <FullDocument {...fullDocumentProps}>
        {/* <Select
          {...({
            name: "recurring",
            selectOptions: Object.entries(EventDocumentsRecurringOptions).map(
              ([stringValue]) => {
                return {
                  key: stringValue,
                  value: stringValue,
                  content: stringValue,
                } as SelectOption;
              }
            ),
            options: { required: true },
          } as SelectProps<EventDocumentsRecord>)}
        ></Select> */}
        <Select
          {...({
            id: "toFullDocument",
            label: "Parent document",
            name: "toFullDocument",
            selectOptions: toFullDocumentsList.map((toFullDocument) => {
              return {
                key: toFullDocument.id,
                value: toFullDocument.id,
                content: toFullDocument.expand.userDocument_name,
              } as SelectOption;
            }),
            onChange: (e) => {
              setToFullDocument(e.currentTarget.value);
            },
            element: docLink,
            defaultValue: toFullDocument,
            disabled: !isEventOwner,
          } as SelectProps<EventDocumentsRecord>)}
        >
          <option value="" disabled>
            Link event to a document
          </option>
          <option value=""></option>
        </Select>
      </FullDocument>
    </main>
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
    .getOne<EventDocumentsResponse<FullDocumentsExpand>>(eventDocId, {
      expand: "fullDocument.document",
    });

  const toFullDocuments =
    await pbServer.apiGetList<FullDocumentsCustomResponse>(
      "/api/user/getHasWriteFullDocuments?fullList=true"
    );

  const fullDocument = eventDocument.expand?.fullDocument;
  const fullDocId = fullDocument?.id;

  if (!fullDocId) {
    return {
      redirect: {
        destination: "/notFound",
        permanent: false,
      },
    };
  }

  const fullDocumentData = await fetchFullDocumentData(
    pbServer,
    user,
    fullDocId
  );

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocumentData,
        eventDocument,
        toFullDocuments,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

EventDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default EventDocument;
