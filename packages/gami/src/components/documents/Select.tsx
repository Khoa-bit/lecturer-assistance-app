import type { ChangeEventHandler, ReactNode } from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { FullDocumentChildProps } from "./FullDocument";

export interface SelectOption {
  key: string;
  value: string;
  content: string | JSX.Element;
}

export interface SelectProps<TFieldValues extends FieldValues = FieldValues>
  extends FullDocumentChildProps<TFieldValues> {
  id: string;
  label: string;
  name: Path<TFieldValues>;
  selectOptions: SelectOption[];
  children?: ReactNode | ReactNode[];
  element?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  defaultValue?: string;
}

function Select<TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  name,
  selectOptions,
  register,
  options,
  children,
  element,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  defaultValue,
  ...rest
}: SelectProps<TFieldValues>) {
  if (!register) return <></>;

  const registerOptions = register(name, options);

  return (
    <>
      <label className="py-2" htmlFor={id}>
        {label}
      </label>
      {!element ? (
        <select
          id={id}
          {...registerOptions}
          onChange={(e) => {
            registerOptions.onChange(e);
            if (onChange) onChange(e);
          }}
          defaultValue={defaultValue}
          {...rest}
          className={`select-bordered select required:select-error invalid:select-error`}
        >
          {children}
          {selectOptions.map((selectOption) => (
            <option key={selectOption.key} value={selectOption.value}>
              {selectOption.content}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative flex items-center">
          <select
            id={id}
            {...registerOptions}
            onChange={(e) => {
              registerOptions.onChange(e);
              if (onChange) onChange(e);
            }}
            defaultValue={defaultValue}
            {...rest}
            className={`select-bordered select flex-grow`}
          >
            {children}
            {selectOptions.map((selectOption) => (
              <option key={selectOption.key} value={selectOption.value}>
                {selectOption.content}
              </option>
            ))}
          </select>
          {element}
        </div>
      )}
    </>
  );
}

export default Select;
