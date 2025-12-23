"use client";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export function UserList({ currentItems, offset }: any) {
  const router = useRouter();

  const statusBadge = (status: string) => {
    if (status === "ACTIVE") return "bg-green-100 text-green-700";
    if (status === "BLOCK") return "bg-red-100 text-red-700";
    if (status === "WITHDRAW") return "bg-gray-100 text-gray-600";
    return "";
  };

  const statusText = (status: string) => {
    if (status === "ACTIVE") return "정상";
    if (status === "BLOCK") return "차단";
    if (status === "WITHDRAW") return "탈퇴";
    return status;
  };

  return (
    <div className="border-t">
      {/* 헤더 */}
      <div className="grid grid-cols-7 bg-gray-50 p-3 text-sm">
        <div>No</div>
        <div>이름</div>
        <div>아이디</div>
        <div>이메일</div>
        <div>상태</div>
        <div>가입일</div>
        <div>상세</div>
      </div>

      {/* 리스트 */}
      {currentItems.map((u: any, idx: number) => (
        <div
          key={u.memberId}
          className="grid grid-cols-7 p-3 border-t text-sm hover:bg-gray-50"
          onClick={() => router.push(`/user/${u.memberId}`)}
        >
          <div>{offset + idx + 1}</div>
          <div>{u.name}</div>
          <div>{u.userId}</div>
          <div>{u.email}</div>
          <div>
            <span
              className={`px-2 py-1 rounded text-xs ${statusBadge(u.status)}`}
            >
              {statusText(u.status)}
            </span>
          </div>
          <div>{dayjs(u.createdAt).format("YYYY-MM-DD")}</div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/user/${u.memberId}`);
              }}
              className="underline cursor-pointer"
            >
              상세
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
