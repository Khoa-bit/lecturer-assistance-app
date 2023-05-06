import type { ReactElement } from "react";
import type { FieldArray, FieldArrayPath, FieldValues } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { IcRoundAddCircle } from "../icons/IcRoundAddCircle";
import { IcRoundRemoveCircle } from "../icons/IcRoundRemoveCircle";
import type { FullDocumentChildArrayProps } from "./FullDocument";

export interface CardFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
> extends FullDocumentChildArrayProps<TFieldValues, TFieldArrayName> {
  id: string;
  label: string;
  childrenFactory: (index: number) => ReactElement | ReactElement[];
  defaultValue:
    | FieldArray<TFieldValues, TFieldArrayName>
    | FieldArray<TFieldValues, TFieldArrayName>[];
}

function CardForm<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>
>({
  id,
  label,
  name,
  control,
  childrenFactory,
  defaultValue,
  options,
}: CardFormProps<TFieldValues, TFieldArrayName>) {
  const { fields, append, remove } = useFieldArray<
    TFieldValues,
    TFieldArrayName
  >({
    control,
    name,
  });

  return (
    <>
      <label className="py-2" htmlFor={id}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => append(defaultValue)}
        className="flex h-10 w-fit cursor-pointer items-center gap-1 rounded bg-gray-200 p-2 font-semibold hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-200"
        disabled={options?.disabled}
      >
        <IcRoundAddCircle className="h-6 w-6 text-gray-500"></IcRoundAddCircle>
        <span>Add</span>
      </button>
      {!!fields.length && (
        <div id={id} className="col-span-2 flex flex-col gap-4">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="group rounded-btn relative grid grid-cols-[minmax(13rem,1fr)_minmax(0,2fr)] gap-4 border bg-gray-50 p-4 xl:ml-4"
              >
                {childrenFactory(index)}
                <button
                  type="button"
                  className="invisible absolute -right-3 -top-3 disabled:cursor-not-allowed disabled:bg-gray-200 group-hover:visible"
                  onClick={() => remove(index)}
                  disabled={options?.disabled}
                >
                  <IcRoundRemoveCircle className="h-8 w-8 p-1 text-gray-500 hover:text-red-400"></IcRoundRemoveCircle>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default CardForm;
