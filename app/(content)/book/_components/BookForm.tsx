"use client";

import { SelectOpt, RequestBookInfo } from "@/app/_types/book";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  getAuthor,
  getCategory,
  getPublisher,
  getSubCategory,
} from "../create-book/_api/getSelectOpt";
import { BookInput } from "../create-book/_components/BookInput";
import { CheckBox } from "../create-book/_components/CheckBox";
import Select from "react-select/base";
import dynamic from "next/dynamic";
const BookSelect = dynamic(
  () => import("../create-book/_components/BookSelect"),
  {
    ssr: false,
  }
);
// BookForm 재사용성 높이기 위한 작업
type BookFormProps = {
  submitHandler: SubmitHandler<RequestBookInfo>;
  updateData?: RequestBookInfo;
  formType: "create" | "update";
};

export function BookForm({
  submitHandler,
  formType,
  updateData,
}: BookFormProps) {
  const { register, handleSubmit, control, watch, reset } =
    useForm<RequestBookInfo>({});

  const [category, setCategory] = useState<SelectOpt[]>([]);
  const [subCategory, setSubCategory] = useState<SelectOpt[]>([]);
  const [publisher, setPublisher] = useState<SelectOpt[]>([]);
  const [author, setAuthor] = useState<SelectOpt[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const watchCategory = watch("categoryId");

  // init form
  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const categories = await getCategory();
      const publishers = await getPublisher();
      const authors = await getAuthor();
      const subCategories = await getSubCategory(categories[0]);

      if (
        categories.length > 0 &&
        publishers.length > 0 &&
        authors.length > 0 &&
        subCategories.length > 0
      ) {
        setCategory(categories);
        setPublisher(publishers);
        setAuthor(authors);
        setSubCategory(subCategories);

        if (!updateData) {
          // 선택하세요를 넣으면 필요없는 부분
          const categoryId = categories[0];
          const subCategoryId = subCategories[0];
          const publisherId = publishers[0];
          reset({ categoryId, publisherId, subCategoryId });
        } else {
          reset(updateData);
        }
        setIsLoading(false);
      }
    })();
  }, []);

  // 서브카테고리 감시
  useEffect(() => {
    (async () => {
      const subCategories = await getSubCategory(watchCategory);
      if (!subCategories) {
        return;
      }
      setSubCategory(subCategories);
    })();
  }, [watchCategory]);

  const formBox = `grid mb-2 bg-white rounded-xl p-8 shadow-sm`;

  return (
    <div className="p-20 h-auto text">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex  flex-col form-bg ms-auto me-auto w-3xl rounded-2xl p-5"
      >
        <div className={`flex flex-col mb-2 bg-white rounded-xl p-8 shadow-sm`}>
          <BookInput
            title="책 제목"
            label="title"
            register={register}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className={`${formBox}`}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <BookSelect
                  multi={false}
                  field={field}
                  options={category}
                  title="카테고리"
                />
              )}
            />

            <Controller
              name="subCategoryId"
              control={control}
              render={({ field }) => (
                <BookSelect
                  multi={false}
                  field={field}
                  options={subCategory}
                  title="서브카테고리"
                />
              )}
            />
          </div>
          <div className={`${formBox}`}>
            {/* <Controller
              name="subCategoryId"
              control={control}
              render={({ field }) => (
                <BookSelect
                  multi={false}
                  field={field}
                  options={subCategory}
                  title="서브카테고리"
                />
              )}
            /> */}
          </div>
          <div className={`${formBox}`}>
            <h3 className="font-bold mb-2.5">작가</h3>
            <Controller
              name="authorId"
              control={control}
              render={({ field }) => (
                <BookSelect
                  multi={true}
                  field={field}
                  options={author}
                  title="서브카테고리"
                />
              )}
            />
          </div>
        </div>

        <div className={`${formBox}`}>
          <BookInput
            title="가격"
            label="price"
            register={register}
            type="number"
            min={0}
          />

          <BookInput
            title="포인트"
            label="point"
            register={register}
            min={0}
            type="number"
          />
        </div>

        <div className={`${formBox} grid-cols-[1fr_2fr]`}>
          <label className="form-label">출판일</label>
          <div>
            <Controller
              name="publishedDate"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value, onBlur } }) => (
                <DatePicker
                  className={`form-input w-full`}
                  onChange={(date) => {
                    if (!date) return;
                    onChange(dayjs(date).format("YYYY-MM-DD"));
                  }}
                  value={value}
                  onBlur={onBlur}
                />
              )}
            />
          </div>
        </div>

        <div className={`${formBox}`}>
          <label className="form-label">설명</label>
          <textarea
            className={`resize-none form-input`}
            {...register("description")}
          ></textarea>
        </div>

        <button
          className="bg-blue-500 rounded-2xl p-4 text-slate-100 font-bold text-xl"
          type="submit"
        >
          {formType === "create" ? "등록" : "수정"}
        </button>
      </form>
    </div>
  );
}
