import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type BookInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: Path<T>;
  required?: boolean;
  min?: number;
  title: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function BookInput<T extends FieldValues>({
  register,
  label,
  title,
  required,
  min,
  ...rest
}: BookInputProps<T>) {
  return (
    <>
      <label className="font-bold form-text mb-1">{title}</label>
      <input
        className="form-input"
        {...register(label, { required, min })}
        min={min}
        {...rest}
      />
    </>
  );
}
