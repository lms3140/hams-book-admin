"use client";

import { useState } from "react";

export type OrderFilterValue = {
  period: string;
  status: string;
  keyword: string;
};

interface OrderFilterProps {
  onSearch: (filter: OrderFilterValue) => void;
}

export function OrderFilter({ onSearch }: OrderFilterProps) {
  const [period, setPeriod] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch({ period, status, keyword });
  };

  return (
    <div className="flex items-end gap-4 p-4 border-b bg-gray-50">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">기간</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 px-3 border rounded-md text-sm"
        >
          <option value="ALL">전체</option>
          <option value="7">최근 7일</option>
          <option value="30">최근 30일</option>
          <option value="90">최근 3개월</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">상태</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 px-3 border rounded-md text-sm"
        >
          <option value="ALL">전체</option>
          <option value="PAID">배송준비중</option>
          <option value="DELIVER">배송중</option>
          <option value="READY">결제대기</option>
          <option value="CANCEL">취소</option>
          <option value="FAIL">결제실패</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <input
          type="text"
          value={keyword}
          placeholder="검색어를 입력해주세요."
          onChange={(e) => setKeyword(e.target.value)}
          className="h-10 px-3 border rounded-md tesx-sm w-full"
        />
      </div>

      <button
        onClick={handleSearch}
        className="h-10 px-6 bg-black text-white text-sm rounded-md hover:bg-gray-800"
      >
        검색
      </button>
      <button
        className="h-10 px-6 bg-black text-white text-sm rounded-md hover:bg-gray-800"
        onClick={() => window.location.reload()}
      >
        초기화
      </button>
    </div>
  );
}
