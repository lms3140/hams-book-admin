"use client";

import {
  SelectOpt,
  RequestBookInfo,
  RespBookUpdateData,
} from "@/app/_types/book";
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
// import BookSelect from "../create-book/_components/BookSelect";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { postClientFetch } from "@/app/_lib/api/client/fetch";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";
const BookSelect = dynamic(
  () => import("../create-book/_components/BookSelect"),
  {
    ssr: false,
  }
);
// BookForm 재사용성 높이기 위한 작업
type BookFormProps = {
  updateData?: RespBookUpdateData;
  formType: "create" | "update";
};

export function BookForm({ formType, updateData }: BookFormProps) {
  const { register, handleSubmit, control, watch, reset } =
    useForm<RequestBookInfo>({});

  const [category, setCategory] = useState<SelectOpt[]>([]);
  const [subCategory, setSubCategory] = useState<SelectOpt[]>([]);
  const [publisher, setPublisher] = useState<SelectOpt[]>([]);
  const [author, setAuthor] = useState<SelectOpt[]>([]);

  const [_, setIsLoading] = useState(false); // 다른 대안이 있나 보는중
  const watchCategory = watch("category");

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
          const category = categories[0];
          const subCategory = subCategories[0];
          const publisher = publishers[0];
          reset({ category, publisher, subCategory });
        } else {
          const category = categories.find(
            (v) => v.value === updateData.category
          );
          const author = updateData.author.map((value) =>
            authors.find((opt) => opt.value === value)
          );
          const subCategory = subCategories.find(
            (v) => v.value === updateData.subCategory
          );
          const publisher = publishers.find(
            (v) => v.value === updateData.publisher
          );
          const bookId = updateData.bookId;

          reset({
            ...updateData,
            bookId,
            author,
            category,
            subCategory,
            publisher,
          });
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

  const router = useRouter();
  const saveBook = async (data: RequestBookInfo) => {
    console.log(data);
    try {
      const { resp } = await postClientFetch(
        `${SERVER_URL}/admin/book/save`,
        data
      );
      console.log(resp.status);
      if (resp.status === 201) {
        Swal.fire({ title: "등록성공", icon: "success", timer: 1000 });
        router.replace("/book");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const formBox = `grid mb-2 bg-white rounded-xl p-8 shadow-sm`;

  return (
    <div className="p-20 h-auto text">
      <form
        onSubmit={handleSubmit(saveBook)}
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
              name="category"
              control={control}
              render={({ field }) => (
                <BookSelect
                  isMulti={false}
                  field={field}
                  options={category}
                  title="카테고리"
                />
              )}
            />

            <Controller
              name="subCategory"
              control={control}
              render={({ field }) => (
                <BookSelect
                  isMulti={false}
                  field={field}
                  options={subCategory}
                  title="서브카테고리"
                />
              )}
            />
          </div>
          <div className={`${formBox}`}>
            <Controller
              name="publisher"
              control={control}
              render={({ field }) => (
                <BookSelect
                  isMulti={false}
                  field={field}
                  options={publisher}
                  title="출판사"
                />
              )}
            />
          </div>
          <div className={`${formBox}`}>
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <BookSelect
                  isMulti={true}
                  field={field}
                  options={author}
                  title="작가"
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
