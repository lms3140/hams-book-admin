import { RequestBookInfo, SelectOpt } from "@/app/_types/book";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import Select from "react-select";
import { GroupBase, OptionsOrGroups } from "react-select";

type SelectProps<IsMulti extends boolean> = {
  options: OptionsOrGroups<SelectOpt, GroupBase<SelectOpt>>;
  title: string;
  field: ControllerRenderProps<RequestBookInfo, any>;
  multi: IsMulti;
};

export default function BookSelect<IsMulti extends boolean>({
  title,
  options,
  field,
}: SelectProps<IsMulti>) {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <label className="form-label mb-1">{title}</label>

      <Select<SelectOpt, IsMulti>
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
        isClearable
      />
    </>
  );
}
