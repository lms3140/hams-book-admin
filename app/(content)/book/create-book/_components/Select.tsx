import { RequestBookInfo } from "@/app/_types/book";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type SelectOption = {
  id: string;
  value: string;
};

type SelectProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: Path<T>;
  list: SelectOption[];
  title: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select<T extends FieldValues>({
  register,
  title,
  label,
  list,
  ...rest
}: SelectProps<T>) {
  return (
    <>
      <label className="form-label mb-1">{title}</label>
      <select className="form-input" {...register(label)} {...rest}>
        {list.map((v) => (
          <option key={v.id} value={v.id}>
            {v.value}
          </option>
        ))}
      </select>
    </>
  );
}
