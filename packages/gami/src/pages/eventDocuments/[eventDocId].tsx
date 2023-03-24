import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type { ListResult } from "pocketbase";
import type {
  DocumentsResponse,
  EventDocumentsRecord,
  EventDocumentsResponse,
  FullDocumentsCustomResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections, EventDocumentsRecurringOptions } from "raito";
import type {
  FullDocumentData,
  FullDocumentProps,
} from "src/components/documents/FullDocument";
import FullDocument, {
  fetchFullDocumentData,
} from "src/components/documents/FullDocument";
import type { InputProps } from "src/components/documents/Input";
import Input from "src/components/documents/Input";
import type {
  SelectOption,
  SelectProps,
} from "src/components/documents/Select";
import Select from "src/components/documents/Select";
import MainLayout from "src/components/layouts/MainLayout";
import { dateToISOLikeButLocalOrUndefined } from "src/lib/input_handling";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

interface DocumentData {
  fullDocumentData: FullDocumentData;
  eventDocument: EventDocumentsResponse<FullDocumentsExpand>;
  toFullDocuments: ListResult<FullDocumentsCustomResponse>;

  pbAuthCookie: string;
}

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
  const toFullDocuments = dataParse.toFullDocuments;
  const fullDocumentData = dataParse.fullDocumentData;

  const childCollectionName = Collections.EventDocuments;
  const childId = eventDocument.id;

  const fullDocumentProps: FullDocumentProps<EventDocumentsRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    user,
    childrenDefaultValue: {
      fullDocument: eventDocument.fullDocument,
      startTime: dateToISOLikeButLocalOrUndefined(eventDocument.startTime),
      endTime: dateToISOLikeButLocalOrUndefined(eventDocument.endTime),
      recurring: eventDocument.recurring,
      toFullDocument: eventDocument.toFullDocument,
    },
    hasEvents: false,
  };

  return (
    <>
      <Head>
        <title>Full Document</title>
      </Head>
      <h1>Full Document</h1>
      <FullDocument {...fullDocumentProps}>
        <Input
          {...({
            name: "startTime",
            options: { required: true },
            type: "datetime-local",
          } as InputProps<EventDocumentsRecord>)}
        ></Input>
        <Input
          {...({
            name: "endTime",
            options: { required: true },
            type: "datetime-local",
          } as InputProps<EventDocumentsRecord>)}
        ></Input>
        <Select
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
        ></Select>
        <Select
          {...({
            name: "toFullDocument",
            selectOptions: toFullDocuments.items.map((toFullDocument) => {
              return {
                key: toFullDocument.id,
                value: toFullDocument.id,
                content: toFullDocument.expand.userDocument_name,
              } as SelectOption;
            }),
            options: { required: true },
            defaultValue: eventDocument.toFullDocument,
          } as SelectProps<EventDocumentsRecord>)}
        >
          <option value="" disabled hidden>
            Link event to a document
          </option>
        </Select>
      </FullDocument>
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
    .getOne<EventDocumentsResponse<FullDocumentsExpand>>(eventDocId, {
      expand: "fullDocument.document",
    });

  const toFullDocuments =
    await pbServer.apiGetList<FullDocumentsCustomResponse>(
      "/api/user/fullDocuments?fullList=true"
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
