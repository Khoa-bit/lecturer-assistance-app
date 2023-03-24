import type { FieldValues } from "react-hook-form";
import type { FullDocumentChildProps } from "./FullDocument";

export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  FullDocumentChildProps<TFieldValues>;

function Input<TFieldValues extends FieldValues = FieldValues>({
  name,
  type,
  register,
  options,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue, // FullDocument injects setValue => must be available
  ...rest
}: InputProps<TFieldValues>) {
  if (!register) return <></>;

  return <input {...register(name, options)} {...rest} type={type ?? "text"} />;
}

export default Input;
