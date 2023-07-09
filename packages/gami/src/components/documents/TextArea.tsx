import type { ChangeEventHandler } from "react";
import type { FieldValues } from "react-hook-form";
import type { FullDocumentChildProps } from "./FullDocument";

export interface TextAreaProps<TFieldValues extends FieldValues = FieldValues>
  extends FullDocumentChildProps<TFieldValues> {
  id: string;
  label: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
}

function TextArea<TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  name,
  register,
  options,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  ...rest
}: TextAreaProps<TFieldValues>) {
  if (!id) console.error("Missing id", name);
  if (!label) console.error("Missing label", name);
  if (!register) return <></>;
  const registerOptions = register(name, options);

  return (
    <>
      <label className="py-2" htmlFor={id}>
        {label}
      </label>
      <textarea
        className={`textarea-bordered textarea invalid:textarea-error`}
        id={id}
        {...registerOptions}
        {...rest}
        onChange={(e) => {
          registerOptions.onChange(e);
          if (onChange) onChange(e);
        }}
        required={Boolean(options?.required ?? false)}
      />
    </>
  );
}

export default TextArea;
