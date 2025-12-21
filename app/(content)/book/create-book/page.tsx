"use client";

import { postClientFetch } from "@/app/_lib/api/client/fetch";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import { RequestBookInfo } from "@/app/_types/book";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { BookForm } from "../_components/BookForm";

export default function Page() {
  const router = useRouter();
  const createBook = async (data: RequestBookInfo) => {
    console.log(data);
    // try {
    //   const { resp } = await postClientFetch(`${SERVER_URL}/book/create`, data);
    //   console.log(resp.status);
    //   if (resp.status === 201) {
    //     Swal.fire({ title: "등록성공", icon: "success", timer: 1000 });
    //     router.replace("/book");
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <div>
      <BookForm submitHandler={createBook} formType="create" />
    </div>
  );
}
