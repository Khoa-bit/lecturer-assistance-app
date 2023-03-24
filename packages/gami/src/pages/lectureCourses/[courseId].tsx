import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type {
  CoursesRecord,
  CoursesResponse,
  CourseTemplatesRecord,
  CourseTemplatesResponse,
  DocumentsResponse,
  FullDocumentsResponse,
} from "raito";
import { Collections } from "raito";
import { useCallback, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
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
import { usePBClient } from "src/lib/pb_client";
import { getPBServer } from "src/lib/pb_server";
import SuperJSON from "superjson";

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

interface CourseTemplateInput extends CourseTemplatesRecord {
  id: string;
}

function CourseDocument({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dataParse = SuperJSON.parse<DocumentData>(data);

  const { pbClient, user } = usePBClient(dataParse.pbAuthCookie);
  const course = dataParse.course;
  const fullDocumentData = dataParse.fullDocumentData;
  const courseTemplateId = course.courseTemplate;
  const initCourseTemplatesOptions = dataParse.courseTemplatesOptions;
  const [courseTemplatesOptions, setCourseTemplatesOptions] = useState<
    CourseTemplatesResponse[]
  >(initCourseTemplatesOptions);

  const courseTemplatesOption = courseTemplatesOptions.find(
    (courseTemplatesOption) => courseTemplatesOption.id == courseTemplateId
  );
  const [templateCourseId, setTemplateCourseId] = useState<string>(
    courseTemplatesOption?.courseId ?? ""
  );
  const [templatePeriodsCount, setTemplatePeriodsCount] = useState<number>(
    courseTemplatesOption?.periodsCount ?? 0
  );

  const childCollectionName = Collections.Courses;
  const childId = course.id;

  const fullDocumentProps: FullDocumentProps<CoursesRecord> = {
    childCollectionName,
    childId,
    ...fullDocumentData,
    pbClient,
    user,
    childrenDefaultValue: {
      fullDocument: course.fullDocument,
      semester: course.semester,
      courseTemplate: courseTemplateId,
    },
  };

  const { register, handleSubmit } = useForm<CourseTemplateInput>();
  const onSubmitTemplate: SubmitHandler<CourseTemplateInput> = useCallback(
    (inputData) => {
      pbClient
        .collection(Collections.CourseTemplates)
        .create<CourseTemplatesResponse>({
          name: inputData.name,
          courseId: inputData.courseId,
          periodsCount: inputData.periodsCount,
        } as CourseTemplatesRecord)
        .then((newCourseTemplatesOption) => {
          console.log(newCourseTemplatesOption);
          setCourseTemplatesOptions((courseTemplatesOptions) => [
            ...courseTemplatesOptions,
            newCourseTemplatesOption,
          ]);
        });
    },
    [pbClient]
  );

  const courseTemplateOnChange = (courseTemplateId: string) => {
    const courseTemplatesOption = courseTemplatesOptions.find(
      (courseTemplatesOption) => courseTemplatesOption.id == courseTemplateId
    );

    setTemplateCourseId(
      (templateCourseId) => courseTemplatesOption?.courseId ?? templateCourseId
    );
    setTemplatePeriodsCount(
      (templatePeriodsCount) =>
        courseTemplatesOption?.periodsCount ?? templatePeriodsCount
    );
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
            name: "semester",
            options: { required: true },
          } as InputProps<CoursesRecord>)}
        ></Input>
        <Select
          {...({
            name: "courseTemplate",
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
            defaultValue: templateCourseId,
            onChange: (e) => {
              courseTemplateOnChange(e.currentTarget.value);
            },
          } as SelectProps<CoursesRecord>)}
        >
          <option value="" disabled hidden>
            Select Course Template
          </option>
        </Select>
        <input id="courseId" disabled value={templateCourseId} />
        <input id="periodsCount" disabled value={templatePeriodsCount} />
      </FullDocument>
      <h2>New course template modal</h2>
      <form onSubmit={handleSubmit(onSubmitTemplate)}>
        <input {...register("name")} />
        <input {...register("courseId")} />
        <input {...register("periodsCount")} />
        <input type="submit" value="Create new course template" />
      </form>
    </>
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
