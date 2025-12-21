import { getServerFetch } from "@/app/_lib/api/server/fetch";
import { BookForm } from "../../_components/BookForm";
import { SERVER_URL } from "@/app/_lib/api/common/config";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const bookInfo = await getServerFetch(
    `${SERVER_URL}/book/admin/detail/${id}`
  );
  return (
    <div>
      <BookForm formType="update" updateData={{ ...bookInfo, bookId: id }} />
    </div>
  );
}
