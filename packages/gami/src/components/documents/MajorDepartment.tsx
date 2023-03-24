import type { DepartmentsResponse, MajorsResponse } from "raito";
import { Collections } from "raito";
import { useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { env } from "src/env/client.mjs";
import type { PBCustom } from "src/types/pb-custom";
import type { FullDocumentChildProps } from "./FullDocument";
import type { SelectOption, SelectProps } from "./Select";
import Select from "./Select";

interface MajorDepartmentProps<TFieldValues extends FieldValues = FieldValues>
  extends FullDocumentChildProps<TFieldValues> {
  initDepartmentId: string;
  initMajorOptions: MajorsResponse<unknown>[];
  departments: DepartmentsResponse[];
  pbClient: PBCustom;
}

interface MajorDepartmentInput extends FieldValues {
  department: string;
  major: string;
}

function MajorDepartment({
  name, // For FullDocument to inject => `name` prop must be available
  initDepartmentId,
  initMajorOptions,
  departments,
  pbClient,
  register,
  options,
  setValue,
}: MajorDepartmentProps<MajorDepartmentInput>) {
  if (env.NEXT_PUBLIC_DEBUG_MODE && name != "major")
    console.warn(
      "Name must be major - parameters is available here for FullDocument to detect if this is an input field"
    );
  const [departmentId, setDepartmentId] = useState<string>(initDepartmentId);
  const [majorOptions, setMajorOptions] =
    useState<MajorsResponse[]>(initMajorOptions);

  useEffect(() => {
    setTimeout(async () => {
      const majorOptions = await pbClient
        .collection(Collections.Majors)
        .getFullList<MajorsResponse>({
          filter: `department="${departmentId}"`,
        })
        .catch(() => undefined);

      if (majorOptions) setMajorOptions(majorOptions);
    }, 0);
  }, [departmentId, pbClient]);

  return (
    <>
      <Select
        {...({
          name: "department",
          register,
          selectOptions: departments.map((department) => {
            return {
              key: department.id,
              value: department.id,
              content: department.name,
            } as SelectOption;
          }),
          options: { ...options, required: true },
          onChange: (event) => {
            setDepartmentId(event.currentTarget.value);
            if (setValue) setValue("major", "");
          },
          defaultValue: departmentId,
        } as SelectProps<MajorDepartmentInput>)}
      >
        <option value="" disabled hidden>
          Select department
        </option>
      </Select>
      <Select
        {...({
          name: "major",
          register,
          selectOptions: majorOptions.map((major) => {
            return {
              key: major.id,
              value: major.id,
              content: major.name,
            } as SelectOption;
          }),
          options: { ...options, required: true },
        } as SelectProps<MajorDepartmentInput>)}
      >
        <option value="" disabled hidden>
          Select major
        </option>
      </Select>
    </>
  );
}

export type FetchMajorDepartmentFunc = (
  departmentId: string,
  pbServer: PBCustom
) => Promise<{
  departments: DepartmentsResponse[];
  majorOptions: MajorsResponse<unknown>[];
}>;

export const fetchMajorDepartment: FetchMajorDepartmentFunc = async (
  departmentId,
  pbServer
) => {
  const departments = await pbServer
    .collection(Collections.Departments)
    .getFullList<DepartmentsResponse>({});

  const majorOptions = await pbServer
    .collection(Collections.Majors)
    .getFullList<MajorsResponse>({
      filter: `department="${departmentId}"`,
    });

  return { departments, majorOptions };
};

export default MajorDepartment;
