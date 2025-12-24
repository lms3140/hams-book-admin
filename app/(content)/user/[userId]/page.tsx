"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

type TabType = "INFO" | "ORDER" | "REVIEW";
type UserStatus = "ACTIVE" | "BLOCK" | "WITHDRAW";

export default function UserDetailPage() {
  const { member_id } = useParams(); // PK 기준
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tab, setTab] = useState<TabType>("INFO");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  const fetchUser = async () => {
    if (!member_id) return;
    try {
      const res = await fetch(`${SERVER_URL}/admin/users/${member_id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUser(data);
      setStatus(data.status || "ACTIVE");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "회원 정보를 불러올 수 없습니다." });
    }
  };

  const fetchOrders = async () => {
    if (!member_id) return;
    try {
      const res = await fetch(
        `${SERVER_URL}/admin/users/${member_id}/orders`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };

  const fetchReviews = async () => {
    if (!member_id) return;
    try {
      const res = await fetch(
        `${SERVER_URL}/admin/users/${member_id}/reviews`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [member_id]);

  useEffect(() => {
    if (tab === "ORDER") fetchOrders();
    if (tab === "REVIEW") fetchReviews();
  }, [tab, member_id]);

  const changeStatus = async () => {
    if (!member_id) return;
    try {
      const res = await fetch(`${SERVER_URL}/admin/users/${member_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      Swal.fire({ icon: "success", title: "회원 상태가 변경되었습니다." });
      fetchUser();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "상태 변경 실패" });
    }
  };

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

      {/* 회원 정보 */}
      {tab === "INFO" && (
        <div className="space-y-4">
          <p>아이디: {user.user_id}</p>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>상태: {user.status}</p>
          <p>포인트: {user.point_balance ?? 0}</p>
          <p>
            가입일:{" "}
            {user.created_at
              ? new Date(user.created_at).toISOString().slice(0, 10)
              : "-"}
          </p>

          {/* 상태 변경 */}
          <div className="mt-6 flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="border px-3 py-2"
            >
              <option value="ACTIVE">정상</option>
              <option value="BLOCK">차단</option>
              <option value="WITHDRAW">탈퇴</option>
            </select>
            <button onClick={changeStatus} className="bg-black text-white px-4 py-2">
              상태 변경
            </button>
          </div>
        </div>
      )}

      {/* 주문 내역 */}
      {tab === "ORDER" && (
        <ul className="border-t pt-2">
          {orders.map((o) => (
            <li key={o.orderId}>
              주문번호: {o.orderId} / 상태: {o.orderStatus}
            </li>
          ))}
        </ul>
      )}

      {/* 리뷰 내역 */}
      {tab === "REVIEW" && (
        <ul className="border-t pt-2">
          {reviews.map((r) => (
            <li key={r.reviewId}>
              {r.productName} - {r.rating}점
            </li>
          ))}
        </ul>
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
