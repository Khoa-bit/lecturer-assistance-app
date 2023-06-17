import type {
  CourseTemplatesRecord,
  CourseTemplatesResponse,
} from "src/types/raito";
import {
  Collections,
  CourseTemplatesAcademicProgramOptions,
} from "src/types/raito";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { PBCustom } from "src/types/pb-custom";
import type { InputProps } from "../documents/Input";
import Input from "../documents/Input";
import type { SelectOption, SelectProps } from "../documents/Select";
import Select from "../documents/Select";

interface CourseTemplateInput extends CourseTemplatesRecord {
  id: string;
}

interface NewCourseTemplateProps {
  pbClient: PBCustom;
  setCourseTemplatesOptions: Dispatch<
    SetStateAction<CourseTemplatesResponse[]>
  >;
}

function NewCourseTemplate({
  pbClient,
  setCourseTemplatesOptions,
}: NewCourseTemplateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit } = useForm<CourseTemplateInput>();
  const onSubmitTemplate: SubmitHandler<CourseTemplateInput> = useCallback(
    (inputData) => {
      pbClient
        .collection(Collections.CourseTemplates)
        .create<CourseTemplatesResponse>({
          name: inputData.name,
          academicProgram: inputData.academicProgram,
          courseId: inputData.courseId,
          periodsCount: inputData.periodsCount,
        } as CourseTemplatesRecord)
        .then((newCourseTemplatesOption) => {
          setCourseTemplatesOptions((courseTemplatesOptions) => [
            ...courseTemplatesOptions,
            newCourseTemplatesOption,
          ]);
        })
        .then(() => {
          setIsOpen(false);
        });
    },
    [pbClient, setCourseTemplatesOptions]
  );

  return (
    <>
      <label
        className="ml-2 flex cursor-pointer items-center gap-1 rounded border border-gray-300 p-2 hover:bg-gray-50"
        htmlFor="new-course-template-modal"
        title="Create new course template"
        aria-label="Create new course template"
      >
        <span className="material-symbols-rounded text-gray-500 [font-variation-settings:'FILL'_1]">
          add_circle
        </span>
      </label>
      {createPortal(
        <div>
          <input
            type="checkbox"
            id="new-course-template-modal"
            className="modal-toggle"
            onChange={() => {
              setIsOpen((isOpen) => !isOpen);
            }}
            checked={isOpen}
          />
          <div className="modal modal-bottom sm:modal-middle">
            <label
              htmlFor="new-course-template-modal"
              className={`fixed inset-0 w-full cursor-pointer bg-slate-400/70`}
            ></label>
            <div className="modal-box !rounded-lg bg-white p-2 shadow-lg">
              <h2 className="collapse-title flex p-2 font-semibold text-gray-600">
                <strong className="flex-grow text-xl font-semibold text-gray-700">
                  New course template
                </strong>
                <label
                  htmlFor="new-course-template-modal"
                  title="Close modal"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-rounded cursor-pointer [font-variation-settings:'FILL'_1] hover:text-gray-500">
                    cancel
                  </span>
                </label>
              </h2>
              <small className="block rounded bg-orange-100 px-2 py-1 text-orange-700">
                Make sure there is no duplicate
              </small>
              <form
                className="grid h-fit w-full grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] gap-4 rounded-lg bg-white p-2"
                onSubmit={handleSubmit(onSubmitTemplate)}
              >
                <Input
                  {...({
                    name: "name",
                    id: "name",
                    label: "Course template name",
                    register,
                    options: { required: true },
                  } as InputProps<CourseTemplateInput>)}
                ></Input>
                <Select
                  {...({
                    name: "academicProgram",
                    id: "academicProgram",
                    label: "Academic program",
                    register,
                    selectOptions: Object.entries(
                      CourseTemplatesAcademicProgramOptions
                    ).map(([stringValue]) => {
                      return {
                        key: stringValue,
                        value: stringValue,
                        content: stringValue,
                      } as SelectOption;
                    }),
                    options: { required: true },
                  } as SelectProps<CourseTemplateInput>)}
                ></Select>
                <Input
                  {...({
                    name: "courseId",
                    id: "courseId",
                    label: "Course ID",
                    register,
                    options: { required: true },
                  } as InputProps<CourseTemplateInput>)}
                ></Input>
                <Input
                  {...({
                    name: "periodsCount",
                    id: "periodsCount",
                    label: "Periods count",
                    register,
                    options: { required: true },
                  } as InputProps<CourseTemplateInput>)}
                ></Input>
                <input
                  type="submit"
                  className={`input col-span-2 cursor-pointer rounded bg-blue-500 py-2 font-semibold text-white transition-colors hover:bg-blue-400`}
                  value="Create new course template"
                />
              </form>
            </div>
          </div>
        </div>,
        document.getElementById("next-body") ?? document.body
      )}
    </>
  );
}

interface UseCourseTemplateReturns {
  courseTemplatesOptions: CourseTemplatesResponse[];
  courseTemplateOnChange: (courseTemplateId: string) => void;
  setCourseTemplatesOptions: Dispatch<
    SetStateAction<CourseTemplatesResponse[]>
  >;
  templateAcademicProgram: string;
  templateCourseId: string;
  templatePeriodsCount: number;
}

export function useCourseTemplate(
  initCourseTemplatesOptions: CourseTemplatesResponse[],
  courseTemplateId: string | undefined
): UseCourseTemplateReturns {
  const [courseTemplatesOptions, setCourseTemplatesOptions] = useState<
    CourseTemplatesResponse[]
  >(initCourseTemplatesOptions);

  const courseTemplatesOption = courseTemplatesOptions.find(
    (courseTemplatesOption) => courseTemplatesOption.id == courseTemplateId
  );
  const [templateAcademicProgram, setTemplateAcademicProgram] =
    useState<string>(courseTemplatesOption?.academicProgram ?? "");
  const [templateCourseId, setTemplateCourseId] = useState<string>(
    courseTemplatesOption?.courseId ?? ""
  );
  const [templatePeriodsCount, setTemplatePeriodsCount] = useState<number>(
    courseTemplatesOption?.periodsCount ?? 0
  );

  const courseTemplateOnChange = (courseTemplateId: string) => {
    const courseTemplatesOption = courseTemplatesOptions.find(
      (courseTemplatesOption) => courseTemplatesOption.id == courseTemplateId
    );

    setTemplateAcademicProgram(
      (templateAcademicProgram) =>
        courseTemplatesOption?.academicProgram ?? templateAcademicProgram
    );
    setTemplateCourseId(
      (templateCourseId) => courseTemplatesOption?.courseId ?? templateCourseId
    );
    setTemplatePeriodsCount(
      (templatePeriodsCount) =>
        courseTemplatesOption?.periodsCount ?? templatePeriodsCount
    );
  };

  return {
    courseTemplatesOptions,
    courseTemplateOnChange,
    setCourseTemplatesOptions,
    templateAcademicProgram,
    templateCourseId,
    templatePeriodsCount,
  };
}

export default NewCourseTemplate;
