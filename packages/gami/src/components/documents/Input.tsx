import type { ChangeEventHandler } from "react";
import type { FieldValues } from "react-hook-form";
import type { FullDocumentChildProps } from "./FullDocument";

export interface InputProps<TFieldValues extends FieldValues = FieldValues>
  extends FullDocumentChildProps<TFieldValues> {
  id: string;
  label: string;
  min?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

function Input<TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  min,
  name,
  type,
  register,
  options,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  ...rest
}: InputProps<TFieldValues>) {
  if (!id) console.error("Missing id", name);
  if (!label) console.error("Missing label", name);
  if (!register) return <></>;
  const registerOptions = register(name, options);

  return (
    <>
      <label className="py-2" htmlFor={id}>
        {label}
      </label>
      <input
        className={`input-bordered input`}
        id={id}
        {...registerOptions}
        {...rest}
        type={type ?? "text"}
        onChange={(e) => {
          registerOptions.onChange(e);
          if (onChange) onChange(e);
        }}
        min={min}
      />
    </>
  );
}

export default Input;
