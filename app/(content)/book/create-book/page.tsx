"use client";

import { RequestBookInfo } from "@/app/_types/book";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  getAuthor,
  getCategory,
  getPublisher,
  getSubCategory,
} from "./_api/getSelectOpt";
import Select from "./_components/Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { postClientFetch } from "@/app/_lib/api/client/fetch";
import { BookInput } from "./_components/BookInput";

type Category = {
  value: string;
  id: string;
};

export default function Page() {
  const { register, watch, setValue, handleSubmit, control } =
    useForm<RequestBookInfo>({ defaultValues: { publishedDate: "" } });
  const [category, setCategory] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<Category[]>([]);
  const [publisher, setPublisher] = useState<Category[]>([]);
  const [author, setAuthor] = useState<Category[]>([]);
  const watchCategory = watch("categoryId");

  useEffect(() => {
    (async () => {
      const categories = await getCategory();
      const publishers = await getPublisher();
      const authors = await getAuthor();
      setValue("categoryId", categories[0]?.id);
      setCategory(categories);
      setValue("publisherId", publishers[0]?.id);
      setPublisher(publishers);
      setValue("authorId", authors[0]?.id);
      setAuthor(authors);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const subCategories = await getSubCategory(watchCategory);
      if (!subCategories) {
        return;
      }
      setValue("subCategoryId", subCategories[0]?.id);
      setSubCategory(subCategories);
    })();
  }, [watchCategory]);

  const createBook = async (data: RequestBookInfo) => {
    const resp = await postClientFetch(
      "http://localhost:8080/Book/create",
      data
    );
    console.log(resp);
  };

  const formBox = `grid mb-2 bg-white rounded-xl p-8 shadow-sm`;

  return (
    <div className="p-20 h-auto text">
      <form
        onSubmit={handleSubmit(createBook)}
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
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <div className={`${formBox}`}>
            <Select
              title="카테고리"
              register={register}
              label="categoryId"
              list={category}
            />
            <Select
              title="서브카테고리"
              register={register}
              label="subCategoryId"
              list={subCategory}
            />
          </div>
          <div className={`${formBox}`}>
            <Select
              title="출판사"
              register={register}
              label="publisherId"
              list={publisher}
            />

            <Select
              title="작가"
              register={register}
              label="authorId"
              list={author}
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
          등록
        </button>
      </form>
    </div>
  );
}
