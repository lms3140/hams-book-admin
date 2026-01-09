import { SERVER_URL } from "@/app/_lib/api/common/config";
import { getServerFetch } from "@/app/_lib/api/server/fetch";
import ItemContainer from "./_components/ItemContainer";
import { Book } from "@/app/_types/book";
import { SearchForm } from "../_components/SearchForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const keyword = params.keyword;
  return (
    <>
      <SearchForm />
      <ItemContainer keyword={keyword} />
    </>
  );
}
