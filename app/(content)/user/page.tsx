"use client";

import { useEffect, useState } from "react";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import { usePagination } from "@/app/_store/usePagination";
import Pagination from "@/app/_components/Pagination/Pagination";
import { UserFilter, UserFilterValue } from "./UserFilter";
import { UserList } from "./UserList";

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/admin/users`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const content = data.content ?? data;
        setUsers(content);
        setFilteredUsers(content);
      });
  }, []);

  const handleSearch = (filter: UserFilterValue) => {
    let result = [...users];

    if (filter.status !== "ALL") {
      result = result.filter((u) => u.status === filter.status);
    }

    if (filter.keyword.trim()) {
      const keyword = filter.keyword.trim();
      result = result.filter(
        (u) =>
          u.name.includes(keyword) ||
          u.userId.includes(keyword) ||
          u.email.includes(keyword)
      );
    }

    setFilteredUsers(result);
  };

  const {
    currentItems,
    currentPage,
    pageCount,
    offset,
    handlePageChange,
  } = usePagination(filteredUsers, 10);

  return (
    <div className="p-[30px]">
      {/* 타이틀 영역 */}
      <div className="pb-[10px] border-b mb-6">
        <h1 className="text-4xl pb-[20px]">회원 관리</h1>

        {/* 총 회원수 */}
        <div className="flex gap-[5px]">
          <span>총 회원수</span>
          <span className="text-[#3c9a17]">
            {filteredUsers.length}명
          </span>
        </div>
      </div>

      <UserFilter onSearch={handleSearch} />
      <UserList currentItems={currentItems} offset={offset} />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
