import { getClientFetch } from "@/app/_lib/api/client/fetch";
import {
  RespAuthor,
  RespCategory,
  RespPublisher,
  RespSubCategory,
} from "../_types/category";
import { SelectOpt } from "@/app/_types/book";

export const getCategory = async () => {
  const data = (await getClientFetch("http://localhost:8080/category/list"))
    .data as RespCategory[];
  const selectOpts = data?.map((v: RespCategory) => ({
    label: v.categoryName,
    value: v.categoryId,
  }));
  return selectOpts;
};

export const getPublisher = async () => {
  const data = (await getClientFetch("http://localhost:8080/publisher/list"))
    .data as RespPublisher[];
  const selectOpts = data?.map((v: RespPublisher) => ({
    label: v.name,
    value: v.publisherId,
  }));
  return selectOpts;
};

export const getAuthor = async () => {
  const data = (await getClientFetch("http://localhost:8080/author/list"))
    .data as RespAuthor[];
  const selectOpts = data?.map((v: RespAuthor) => ({
    label: v.name,
    value: v.authorId,
  }));
  return selectOpts;
};

export const getSubCategory = async (categoryId: SelectOpt) => {
  if (!categoryId || categoryId.value === undefined) return [];
  const data = (
    await getClientFetch(
      `http://localhost:8080/category/sub-list?categoryId=${categoryId.value}`
    )
  ).data as RespSubCategory[];

  const newArr = data?.map((v: RespSubCategory) => ({
    label: v.subcategoryName,
    value: v.subcategoryId,
  }));

  return newArr;
};
