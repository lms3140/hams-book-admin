"use client";

import { useState } from "react";

export type UserFilterValue = {
  status: string;
  keyword: string;
};

export function UserFilter({
  onSearch,
  onReset,
}: {
  onSearch: (v: UserFilterValue) => void;
  onReset: () => void;
}) {
  const [status, setStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex gap-3 mb-6">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2"
      >
        <option value="ALL">전체 상태</option>
        <option value="ACTIVE">정상</option>
        <option value="BLOCK">차단</option>
        <option value="WITHDRAW">탈퇴</option>
      </select>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="이름 / 아이디 / 이메일"
        className="border px-3 py-2 flex-1"
      />

      <button
        onClick={() => onSearch({ status, keyword })}
        className="bg-black text-white px-6 py-2"
      >
        검색
      </button>

      <button
        onClick={onReset}
        className="border px-6 py-2"
      >
        초기화
      </button>
    </div>
  );
}
