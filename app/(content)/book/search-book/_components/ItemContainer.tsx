"use client";

import { Book } from "@/app/_types/book";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ItemContainerProps = {
  books: Book[];
};

const columnHelper = createColumnHelper<Book>();

export default function ItemContainer({ books }: ItemContainerProps) {
  const router = useRouter();

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("bookId", {
        header: "ID",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("title", {
        header: "제목",
        cell: (info) => info.getValue(),
      }),

      columnHelper.accessor("authors", {
        header: "저자",
        cell: (info) => {
          const authors = info.getValue();
          if (!authors || authors.length === 0) return "-";
          if (authors.length === 1) return authors[0];
          return `${authors[0]} 외 ${authors.length - 1}명`;
        },
      }),

      columnHelper.accessor("price", {
        header: "가격",
        cell: (info) => info.getValue() + "원",
      }),

      columnHelper.accessor("publishedDate", {
        header: "등록일",
        cell: (info) => info.getValue(),
      }),

      columnHelper.display({
        id: "actions",
        header: "관리",
        cell: ({ row }) => (
          <button
            onClick={() => {
              const id = row.original.bookId;
              router.push(`/book/detail/${id}`);
            }}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            수정
          </button>
        ),
      }),
    ];
  }, []);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="flex-col max-h-full w-full overflow-auto table-fixed border-separate border-spacing-0 flex justify-center">
      <table className="mb-20">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className=" z-20 sticky top-0 bg-slate-100 border-b"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="max-w-80 truncate px-2 border" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
    </div>
  );
}
