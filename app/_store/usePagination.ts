"use client";

import { useState } from "react";

export function usePagination<T>(data: T[] = [], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const pageCount = Math.ceil(data.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return {
    currentPage,
    pageCount,
    currentItems,
    handlePageChange,
    offset,
  };
}
