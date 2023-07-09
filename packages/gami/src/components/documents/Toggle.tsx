import type { ChangeEventHandler } from "react";
import type { FieldValues } from "react-hook-form";
import type { FullDocumentChildProps } from "./FullDocument";

export interface ToggleProps<TFieldValues extends FieldValues = FieldValues>
  extends FullDocumentChildProps<TFieldValues> {
  id: string;
  label: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
}

function Toggle<TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  name,
  register,
  options,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  ...rest
}: ToggleProps<TFieldValues>) {
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
        className={`toggle my-auto invalid:toggle-error`}
        id={id}
        {...registerOptions}
        {...rest}
        type={"checkbox"}
        onChange={(e) => {
          registerOptions.onChange(e);
          if (onChange) onChange(e);
        }}
        required={Boolean(options?.required ?? false)}
      />
    </>
  );
}

export default Toggle;
