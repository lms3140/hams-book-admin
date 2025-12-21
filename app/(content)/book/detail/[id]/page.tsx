import { SERVER_URL } from "@/app/_lib/api/common/config";
import { getServerFetch } from "@/app/_lib/api/server/fetch";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const bookInfo = await getServerFetch(
    `http://localhost:8080/book/detail/${id}`
  );
  console.log(bookInfo);
  return <div></div>;
}
