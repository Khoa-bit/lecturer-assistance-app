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
  name: Path<TFieldValues>;
  selectOptions: SelectOption[];
  children?: ReactNode | ReactNode[];
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  defaultValue?: string;
}

function Select<TFieldValues extends FieldValues = FieldValues>({
  name,
  selectOptions,
  register,
  options,
  children,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  defaultValue,
  ...rest
}: SelectProps<TFieldValues>) {
  if (!register) return <></>;

  const registerOptions = register(name, options);

  return (
    <select
      {...registerOptions}
      onChange={(e) => {
        registerOptions.onChange(e);
        if (onChange) onChange(e);
      }}
      defaultValue={defaultValue}
      {...rest}
    >
      {children}
      {selectOptions.map((selectOption) => (
        <option key={selectOption.key} value={selectOption.value}>
          {selectOption.content}
        </option>
      ))}
    </select>
  );
}

export default Select;
