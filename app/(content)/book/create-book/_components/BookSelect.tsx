import { RequestBookInfo, SelectOpt } from "@/app/_types/book";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import Select from "react-select";
import { GroupBase, OptionsOrGroups } from "react-select";

type SelectProps<T extends boolean> = {
  options: OptionsOrGroups<SelectOpt, GroupBase<SelectOpt>>;
  title: string;
  field: ControllerRenderProps<RequestBookInfo, any>;
  isMulti: T;
};

export default function BookSelect<T extends boolean>({
  title,
  options,
  field,
  isMulti,
}: SelectProps<T>) {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <label className="form-label mb-1">{title}</label>

      <Select<SelectOpt, T>
        options={options}
        value={field.value as SelectOpt | null}
        onChange={(option) => {
          field.onChange(option);
        }}
        inputValue={inputValue}
        onInputChange={(newValue, actionMeta) => {
          if (actionMeta.action === "input-change") {
            setInputValue(newValue);
          }
        }}
        onMenuClose={() => setInputValue("")}
        isMulti={isMulti}
        isClearable
        getOptionValue={(option) => `${option["value"]}`}
      />
    </>
  );
}
