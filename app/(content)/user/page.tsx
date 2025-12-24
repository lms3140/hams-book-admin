"use client";

import { useEffect, useState } from "react";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import { useRouter } from "next/navigation";
import Pagination from "@/app/_components/Pagination/Pagination";
import { UserFilter, UserFilterValue } from "./UserFilter";

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // ===== 회원 리스트 조회 =====
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/users`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = Array.isArray(data.content) ? data.content : data;
      setUsers(content);
      setFilteredUsers(content);
    } catch (err) {
      console.error("회원 조회 실패:", err);
      alert("회원 정보를 불러올 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== 필터 적용 =====
  const handleSearch = (filter: UserFilterValue) => {
    let result = [...users];

    if (filter.status !== "ALL") {
      result = result.filter((u) => u.status === filter.status);
    }

    if (filter.keyword.trim()) {
      const keyword = filter.keyword.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword) ||
          u.user_id.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      );
    }

    setFilteredUsers(result);
  };

  const handleReset = () => setFilteredUsers(users);

  // ===== 페이지네이션 (내부 처리) =====
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUsers.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-[30px]">
      <div className="pb-[10px] border-b mb-6">
        <h1 className="text-4xl pb-[20px]">회원 관리</h1>
        <div className="flex gap-[5px]">
          <span>총 회원수</span>
          <span className="text-[#3c9a17]">{filteredUsers.length}명</span>
        </div>
      </div>

      <UserFilter onSearch={handleSearch} onReset={handleReset} />

      <div className="border-t">
        <div className="grid grid-cols-7 bg-gray-50 p-3 text-sm">
          <div>No</div>
          <div>이름</div>
          <div>아이디</div>
          <div>이메일</div>
          <div>상태</div>
          <div>가입일</div>
          <div>상세 보기</div>
        </div>

        {currentItems.map((u, idx) => {
          const statusBadge =
            u.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : u.status === "BLOCK"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600";

          const statusText =
            u.status === "ACTIVE"
              ? "정상"
              : u.status === "BLOCK"
              ? "차단"
              : "탈퇴";

          return (
            <div
              key={u.member_id}
              className="grid grid-cols-7 p-3 border-t text-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/user/${u.member_id}`)}
            >
              <div>{offset + idx + 1}</div>
              <div>{u.name}</div>
              <div>{u.user_id}</div>
              <div>{u.email}</div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${statusBadge}`}>
                  {statusText}
                </span>
              </div>
              <div>
                {u.created_at
                  ? new Date(u.created_at).toISOString().slice(0, 10)
                  : "-"}
              </div>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/user/${u.member_id}`);
                  }}
                  className="underline cursor-pointer"
                >
                  상세 보기
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
