"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

import UserInfoTab from "./UserInfoTab";
import UserOrderTab from "./UserOrderTab";
import UserReviewTab from "./UserReviewTab";

type TabType = "INFO" | "ORDER" | "REVIEW";

export default function UserDetailPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<TabType>("INFO");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/admin/users/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setUser(await res.json());
    } catch {
      Swal.fire("오류", "회원 정보를 불러올 수 없습니다.", "error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (!user) return <div className="p-6">로딩중...</div>;

  return (
    <div className="p-[30px]">
      <h1 className="text-4xl mb-6">회원 상세</h1>

      {/* 탭 */}
      <div className="flex gap-6 mb-6 border-b">
        {["INFO", "ORDER", "REVIEW"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as TabType)}
            className={`pb-2 ${
              tab === t ? "border-b-2 border-black font-bold" : ""
            }`}
          >
            {t === "INFO" && "회원 정보"}
            {t === "ORDER" && "주문 내역"}
            {t === "REVIEW" && "리뷰 내역"}
          </button>
        ))}
      </div>

      {tab === "INFO" && <UserInfoTab user={user} refresh={fetchUser} />}
      {tab === "ORDER" && <UserOrderTab userId={userId as string} />}
      {tab === "REVIEW" && <UserReviewTab userId={userId as string} />}
    </div>
  );
}
