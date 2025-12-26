"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

type TabType = "INFO" | "ORDER" | "REVIEW";
type UserStatus = "ACTIVE" | "BLOCK" | "WITHDRAW";

export default function UserDetailPage() {
  const params = useParams();
  const memberId = params?.member_id as string;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tab, setTab] = useState<TabType>("INFO");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  // ===== 회원 정보 =====
  const fetchUser = async () => {
    if (!memberId) return;

    try {
      const res = await fetch(`${SERVER_URL}/admin/users/${memberId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      const data = await res.json();

      setUser(data);
      setStatus(data.status);
    } catch {
      Swal.fire("오류", "회원 정보를 불러올 수 없습니다.", "error");
    }
  };

  // ===== 주문 =====
  const fetchOrders = async () => {
    const res = await fetch(
      `${SERVER_URL}/admin/users/${memberId}/orders`,
      { credentials: "include" }
    );
    setOrders(await res.json());
  };

  // ===== 리뷰 =====
  const fetchReviews = async () => {
    const res = await fetch(
      `${SERVER_URL}/admin/users/${memberId}/reviews`,
      { credentials: "include" }
    );
    setReviews(await res.json());
  };

  useEffect(() => {
    fetchUser();
  }, [memberId]);

  useEffect(() => {
    if (tab === "ORDER") fetchOrders();
    if (tab === "REVIEW") fetchReviews();
  }, [tab]);

  if (!user) return <div>로딩중...</div>;

  return (
    <div className="p-[30px]">
      <h1 className="text-4xl mb-6">회원 상세</h1>

      {/* 탭 */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("INFO")}>회원 정보</button>
        <button onClick={() => setTab("ORDER")}>주문 내역</button>
        <button onClick={() => setTab("REVIEW")}>리뷰 내역</button>
      </div>

      {/* INFO */}
      {tab === "INFO" && (
        <div className="space-y-2">
          <p>아이디: {user.userId}</p>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>상태: {user.status}</p>
          <p>포인트: {user.pointBalance}</p>
          <p>
            가입일:{" "}
            {user.createdAt
              ? new Date(user.createdAt).toISOString().slice(0, 10)
              : "-"}
          </p>
        </div>
      )}

      <button
        onClick={() => router.push("/user")}
        className="mt-10 bg-gray-700 text-white px-6 py-2"
      >
        목록으로
      </button>
    </div>
  );
}
