"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { SERVER_URL } from "@/app/_lib/api/common/config";

/* ================= 공통 상태 UI ================= */
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

export default function UserInfoTab({ user, refresh }: any) {
  const [history, setHistory] = useState<any[]>([]);

  const [status, setStatus] = useState(user.status);
  const [statusReason, setStatusReason] = useState("");

  const [pointChange, setPointChange] = useState<number | "">("");
  const [pointReason, setPointReason] = useState("");

  /* ================= 수정 이력 ================= */
  const fetchHistory = async () => {
    const res = await fetch(
      `${SERVER_URL}/admin/users/${user.memberId}/history`,
      { credentials: "include" }
    );
    if (res.ok) {
      setHistory(await res.json());
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= 저장 ================= */
  const save = async () => {
    try {
      if (statusReason) {
        await fetch(`${SERVER_URL}/admin/users/${user.memberId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status,
            reason: statusReason,
          }),
        });
      }

      if (pointChange) {
        await fetch(`${SERVER_URL}/admin/users/${user.memberId}/point`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            amount: pointChange,
            reason: pointReason,
          }),
        });
      }

      Swal.fire("완료", "회원 정보가 수정되었습니다.", "success");

      setStatusReason("");
      setPointChange("");
      setPointReason("");

      refresh();
      fetchHistory();
    } catch {
      Swal.fire("오류", "수정에 실패했습니다.", "error");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      {/* ================= 기본 정보 박스 ================= */}
      <div className="border rounded p-6 space-y-3">
        <h3 className="font-bold text-lg mb-2">기본 정보</h3>

        <div className="flex justify-between">
          <span>이름</span>
          <span>{user.name}</span>
        </div>

        <div className="flex justify-between">
          <span>아이디</span>
          <span>{user.userId}</span>
        </div>

        <div className="flex justify-between">
          <span>이메일</span>
          <span>{user.email}</span>
        </div>

        <div className="flex justify-between">
          <span>상태</span>
          <span
            className={`px-2 py-1 rounded text-xs ${statusBadge(user.status)}`}
          >
            {statusText(user.status)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>가입일</span>
          <span>
            {user.createdAt
              ? dayjs(user.createdAt).format("YYYY-MM-DD")
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>보유 포인트</span>
          <span>{user.pointBalance.toLocaleString()} P</span>
        </div>
      </div>

      {/* ================= 수정 박스 ================= */}
      <div className="border rounded p-6 space-y-4">
        <h3 className="font-bold text-lg mb-2">회원 수정</h3>

        {/* 상태 수정 */}
        <div className="space-y-2">
          <label className="font-semibold">상태 변경</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="ACTIVE">정상</option>
            <option value="BLOCK">차단</option>
            <option value="WITHDRAW">탈퇴</option>
          </select>

          <input
            placeholder="상태 변경 사유"
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <hr />

        {/* 포인트 수정 */}
        <div className="space-y-2">
          <label className="font-semibold">포인트 변경</label>
          <input
            type="number"
            placeholder="증감 포인트"
            value={pointChange}
            onChange={(e) =>
              setPointChange(e.target.value ? Number(e.target.value) : "")
            }
            className="border p-2 w-full"
          />
          <input
            placeholder="포인트 변경 사유"
            value={pointReason}
            onChange={(e) => setPointReason(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <button
          onClick={save}
          className="w-full bg-black text-white py-2 mt-4"
        >
          저장
        </button>
      </div>

      {/* ================= 수정 이력 박스 ================= */}
      <div className="border rounded p-6">
        <h3 className="font-bold text-lg mb-4">수정 이력</h3>

        {history.length === 0 && (
          <p className="text-sm text-gray-400">수정 이력 없음</p>
        )}

        <ul className="text-sm space-y-2">
          {history.map((h) => (
            <li key={h.historyId}>
              {dayjs(h.createdAt).format("YYYY-MM-DD HH:mm")} -{" "}
              <b>{h.type}</b>: {h.beforeValue} → {h.afterValue} ({h.reason})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
