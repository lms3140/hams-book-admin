"use client";

import { getClientFetch } from "@/app/_lib/api/client/fetch";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import { Book } from "@/app/_types/book";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ItemContainerProps = {
  keyword: string | string[] | undefined;
};

const columnHelper = createColumnHelper<Book>();

export default function ItemContainer({ keyword }: ItemContainerProps) {
  const router = useRouter();
  const [bookList, setBookList] = useState<Book[]>([]);
  useEffect(() => {
    (async () => {
      const data = (
        await getClientFetch(`${SERVER_URL}/api/search?keyword=${keyword}`)
      ).data as Book[];
      setBookList(data);
    })();
  }, []);

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
  }, [bookList]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: bookList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="flex w-full flex-col max-h-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700"
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
          {table.getRowModel().rows.map((row, idx) => (
            <tr
              key={row.id}
              className={`${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50"
              } hover:bg-indigo-50 transition`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="max-w-80 truncate border-b border-slate-200 px-3 py-2 text-sm text-slate-800"
                >
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
                <th
                  key={header.id}
                  className="border-t px-3 py-2 text-sm text-slate-600"
                >
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>

        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>

        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>

        <button
          className="rounded border border-slate-300 px-2 py-1 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <div className="flex items-center gap-2">
          <span>
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>

          <span className="flex items-center gap-1">
            이동
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border border-slate-300 px-2 py-1"
            />
          </span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="rounded border border-slate-300 px-2 py-1"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}개씩
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
