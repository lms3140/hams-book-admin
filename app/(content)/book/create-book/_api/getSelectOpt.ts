import { getClientFetch } from "@/app/_lib/api/client/fetch";
import {
  RespAuthor,
  RespCategory,
  RespPublisher,
  RespSubCategory,
} from "../_types/category";

export const getCategory = async () => {
  const data = (await getClientFetch(
    "http://localhost:8080/category/list"
  )) as RespCategory[];
  const selectOpts = data?.map((v: RespCategory) => ({
    value: v.categoryName,
    id: v.categoryId,
  }));
  return selectOpts;
};

export const getPublisher = async () => {
  const data = (await getClientFetch(
    "http://localhost:8080/publisher/list"
  )) as RespPublisher[];
  const selectOpts = data?.map((v: RespPublisher) => ({
    value: v.name,
    id: v.publisherId,
  }));
  return selectOpts;
};

export const getAuthor = async () => {
  const data = (await getClientFetch(
    "http://localhost:8080/author/list"
  )) as RespAuthor[];
  const selectOpts = data?.map((v: RespAuthor) => ({
    value: v.name,
    id: v.authorId,
  }));
  return selectOpts;
};

export const getSubCategory = async (watchCategory: string) => {
  if (watchCategory === "" || watchCategory === undefined) return;
  const data = (await getClientFetch(
    `http://localhost:8080/category/sub-list?categoryId=${watchCategory}`
  )) as RespSubCategory[];

  const newArr = data?.map((v: RespSubCategory) => ({
    value: v.subcategoryName,
    id: v.subcategoryId,
  }));

  return newArr;
};
