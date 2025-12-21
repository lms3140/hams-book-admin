import { SelectOpt } from "@/app/_types/book";
import { InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type BookInputProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: Path<T>;
  required?: boolean;
  min?: number;
  title: string;
  dataList: SelectOpt[];
} & InputHTMLAttributes<HTMLInputElement>;

export function CheckBox<T extends FieldValues>({
  register,
  label,
  title,
  required,
  min,
  dataList,
  ...rest
}: BookInputProps<T>) {
  return (
    <div className="max-h-42 overflow-scroll overflow-y-scroll overflow-x-hidden form-bg border border-slate-300">
      {dataList.map((data) => {
        return (
          <div key={data.value}>
            <input
              id={data.value}
              type="checkbox"
              {...register(label, { required })}
              value={data.value}
            />
            <label htmlFor={data.value} className="font-bold form-text mb-1">
              {data.value}
            </label>
          </div>
        );
      })}
    </div>
  );
}
