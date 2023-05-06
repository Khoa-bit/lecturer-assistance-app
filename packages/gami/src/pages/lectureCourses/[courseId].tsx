import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import type {
  CoursesRecord,
  CoursesResponse,
  CourseTemplatesResponse,
  DocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections, CourseTemplatesAcademicProgramOptions } from "raito";
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
import { useCourseTemplate } from "src/components/lectureCourses/NewCourseTemplate";
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

const NewCourseTemplate = dynamic(
  () => import("src/components/lectureCourses/NewCourseTemplate"),
  {
    ssr: false,
  }
);

interface DocumentData {
  fullDocumentData: FullDocumentData;
  course: CoursesResponse<FullDocumentsExpand>;
  courseTemplatesOptions: CourseTemplatesResponse[];
  pbAuthCookie: string;
}

interface FullDocumentsExpand {
  fullDocument: FullDocumentsResponse<DocumentsExpand>;
}

interface DocumentsExpand {
  document: DocumentsResponse;
}

function CourseDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient } = usePBClient(dataParse.pbAuthCookie);
  const course = dataParse.course;
  const fullDocumentData = dataParse.fullDocumentData;
  const courseTemplateId = course.courseTemplate;
  const initCourseTemplatesOptions = dataParse.courseTemplatesOptions;

  const {
    courseTemplateOnChange,
    courseTemplatesOptions,
    setCourseTemplatesOptions,
    templateAcademicProgram,
    templateCourseId,
    templatePeriodsCount,
  } = useCourseTemplate(initCourseTemplatesOptions, courseTemplateId);

  const childCollectionName = Collections.Courses;
  const childId = course.id;

  const fullDocumentProps: FullDocumentProps<CoursesRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    childrenDefaultValue: {
      fullDocument: course.fullDocument,
      semester: course.semester,
      courseTemplate: courseTemplateId,
    },
  };

  const modal = (
    <NewCourseTemplate
      pbClient={pbClient}
      setCourseTemplatesOptions={setCourseTemplatesOptions}
    ></NewCourseTemplate>
  );

  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col items-center px-4">
      <Head>
        <title>Lecture course</title>
      </Head>
      <FullDocument {...fullDocumentProps}>
        <Input
          {...({
            name: "semester",
            id: "semester",
            label: "Semester",
            options: { required: true },
          } as InputProps<CoursesRecord>)}
        ></Input>
        <Select
          {...({
            name: "courseTemplate",
            id: "courseTemplate",
            label: "Course template",
            selectOptions: courseTemplatesOptions.map(
              (courseTemplatesOption) => {
                return {
                  key: courseTemplatesOption.id,
                  value: courseTemplatesOption.id,
                  content: `${courseTemplatesOption.name} - ${courseTemplatesOption.periodsCount}`,
                } as SelectOption;
              }
            ),
            options: { required: true },
            element: modal,
            defaultValue: templateCourseId,
            onChange: (e) => {
              courseTemplateOnChange(e.currentTarget.value);
            },
          } as SelectProps<CoursesRecord>)}
        >
          <option value="" disabled>
            Select Course Template
          </option>
        </Select>
        <Select
          {...({
            name: "academicProgram",
            id: "academicProgram",
            label: "Academic program",
            selectOptions: Object.entries(
              CourseTemplatesAcademicProgramOptions
            ).map(([stringValue]) => {
              return {
                key: stringValue,
                value: stringValue,
                content: stringValue,
              } as SelectOption;
            }),
            options: { disabled: true },
            value: templateAcademicProgram,
          } as SelectProps)}
        ></Select>
        <Input
          {...({
            name: "courseId",
            id: "courseId",
            label: "Course ID",
            options: { disabled: true },
            value: templateCourseId,
          } as InputProps)}
        ></Input>
        <Input
          {...({
            name: "periodsCount",
            id: "periodsCount",
            label: "Periods count",
            options: { disabled: true },
            value: templatePeriodsCount,
          } as InputProps)}
        ></Input>
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
  const courseId = query.courseId as string;

  const course = await pbServer
    .collection(Collections.Courses)
    .getOne<CoursesResponse<FullDocumentsExpand>>(courseId, {
      expand: "fullDocument.document",
    });

  const fullDocument = course.expand?.fullDocument;
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

  const courseTemplatesOptions = await pbServer
    .collection(Collections.CourseTemplates)
    .getFullList<CourseTemplatesResponse>();

  return {
    props: {
      data: SuperJSON.stringify({
        fullDocumentData,
        course,
        courseTemplatesOptions,
        pbAuthCookie: pbServer.authStore.exportToCookie(),
      } as DocumentData),
    },
  };
};

CourseDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default CourseDocument;
