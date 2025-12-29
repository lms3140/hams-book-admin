"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import Pagination from "@/app/_components/Pagination/Pagination";
import { UserFilter, UserFilterValue } from "./UserFilter";

// 상태에 따른 배지 색상
const statusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "BLOCK":
      return "bg-red-100 text-red-700";
    case "WITHDRAW":
      return "bg-gray-100 text-gray-600";
    default:
      return "";
  }
};

// 상태 텍스트 변환
const statusText = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "정상";
    case "BLOCK":
      return "차단";
    case "WITHDRAW":
      return "탈퇴";
    default:
      return status;
  }
};

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  /* ===== 회원 목록 ===== */
  const fetchUsers = async () => {
    const res = await fetch(`${SERVER_URL}/admin/users`, {
      credentials: "include",
    });
    const data = await res.json();
    const content = Array.isArray(data.content) ? data.content : data;

    setUsers(content);
    setFilteredUsers(content);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ===== 필터 ===== */
  const handleSearch = (filter: UserFilterValue) => {
    let result = [...users];

    if (filter.status !== "ALL") {
      result = result.filter((u) => u.status === filter.status);
    }

    if (filter.keyword.trim()) {
      const keyword = filter.keyword.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword) ||
          u.userId.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );
    }

    setFilteredUsers(result);
  };

  const handleReset = () => setFilteredUsers(users);

  /* ===== 페이지네이션 ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUsers.slice(offset, offset + itemsPerPage);

  return (
    <div className="p-[30px]">
      {/* 제목 */}
      <h1 className="text-4xl mb-2">회원 관리</h1>

      {/* 총 회원 수 */}
      <div className="mb-6 font-semibold">
        총 회원수: <span className="text-[#3c9a17]">{filteredUsers.length}명</span>
      </div>

      {/* 필터 */}
      <UserFilter onSearch={handleSearch} onReset={handleReset} />

      {/* 회원 리스트 헤더 */}
      <div className="grid grid-cols-7 bg-gray-50 p-3 text-sm font-semibold">
        <div>No</div>
        <div>이름</div>
        <div>아이디</div>
        <div>이메일</div>
        <div>상태</div>
        <div>가입일</div>
        <div>상세 보기</div>
      </div>

      {/* 회원 리스트 */}
      {currentItems.map((u, idx) => (
        <div
          key={u.memberId}
          className="grid grid-cols-7 p-3 border-t text-sm hover:bg-gray-50 cursor-pointer"
          onClick={() => router.push(`/user/${u.memberId}`)}
        >
          <div>{offset + idx + 1}</div>
          <div>{u.name}</div>
          <div>{u.userId}</div>
          <div>{u.email}</div>

          {/* 상태 배지 */}
          <div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(u.status)}`}>
              {statusText(u.status)}
            </span>
          </div>

          <div>{u.createdAt?.slice(0, 10) ?? "-"}</div>

          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/user/${u.memberId}`);
              }}
              className="underline cursor-pointer"
            >
              상세 보기
            </button>
          </div>
        </div>
      ))}

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
      />
    </div>
  );
}
