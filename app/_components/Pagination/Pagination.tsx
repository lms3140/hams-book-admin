"use client";

import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: ({ selected }: { selected: number }) => void;
};

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const prevPage = currentPage === 0 ? "" : <IoIosArrowBack />;
  const nextPage = currentPage === pageCount - 1 ? "" : <IoIosArrowForward />;

  return (
    <ReactPaginate
      previousLabel={prevPage}
      nextLabel={nextPage}
      breakLabel={"⋯"}
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={onPageChange}
      containerClassName="flex justify-center items-center gap-2 select-none mt-6"
      pageLinkClassName="flex justify-center items-center w-7 h-7 rounded-full text-gray-700 cursor-pointer hover:bg-gray-200 transition"
      activeLinkClassName="bg-gray-600 text-white font-semibold"
      previousLinkClassName="flex justify-center items-center w-7 h-7 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-200"
      nextLinkClassName="flex justify-center items-center w-7 h-7 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-200"
      disabledClassName="opacity-30 pointer-events-none"
    />
  );
}
