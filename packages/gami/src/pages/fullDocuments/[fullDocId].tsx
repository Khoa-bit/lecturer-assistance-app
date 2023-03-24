import type { GetServerSidePropsContext } from "next";
import type {
  AcademicMaterialsResponse,
  BaseSystemFields,
  ClassesResponse,
  CoursesResponse,
  FullDocumentsResponse,
  PersonalNotesResponse,
} from "raito";
import { Collections } from "raito";
import { getPBServer } from "src/lib/pb_server";

const expandRedirect = [
  "academicMaterials(fullDocument)",
  "classes(fullDocument)",
  "courses(fullDocument)",
  "personalNotes(fullDocument)",
];

interface RedirectExpand {
  "academicMaterials(fullDocument)"?: AcademicMaterialsResponse;
  "classes(fullDocument)"?: ClassesResponse;
  "courses(fullDocument)"?: CoursesResponse;
  "personalNotes(fullDocument)"?: PersonalNotesResponse;
}

function Document() {
  return <></>;
}

export const getServerSideProps = async ({
  req,
  query,
  resolvedUrl,
}: GetServerSidePropsContext) => {
  const { pbServer } = await getPBServer(req, resolvedUrl);
  const fullDocId = query.fullDocId as string;
  const expandStr = expandRedirect.join(",");

  const fullDocument = await pbServer
    .collection(Collections.FullDocuments)
    .getOne<FullDocumentsResponse<RedirectExpand>>(fullDocId, {
      expand: expandStr,
    });

  if (!fullDocument.expand)
    return {
      redirect: {
        destination: "/notFound",
        permanent: false,
      },
    };

  const fullDocumentChild = Object.values(fullDocument.expand).at(0) as
    | BaseSystemFields
    | undefined;

  let uri: string;
  switch (fullDocumentChild?.collectionName) {
    case Collections.AcademicMaterials:
      uri = "academicMaterials";
      break;
    case Collections.Classes:
      uri = "adviseClasses";
      break;
    case Collections.Courses:
      uri = "lectureCourses";
      break;
    case Collections.PersonalNotes:
      uri = "personalNotes";
      break;
    default:
      return {
        redirect: {
          destination: "/notFound",
          permanent: false,
        },
      };
  }

  return {
    redirect: {
      destination: `/${uri}/${fullDocumentChild.id}`,
      permanent: false,
    },
  };
};

export default Document;
