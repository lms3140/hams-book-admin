"use client";

import { SERVER_URL } from "@/app/_lib/api/common/config";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function UserDetailPage() {
  const { memberId } = useParams();
  const router = useRouter();

  const [tab, setTab] = useState("INFO");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${SERVER_URL}/admin/users/${memberId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setStatus(data.status);
      });
  }, [memberId]);

  useEffect(() => {
    if (tab === "ORDER") {
      fetch(`${SERVER_URL}/admin/users/${memberId}/orders`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setOrders);
    }

    if (tab === "REVIEW") {
      fetch(`${SERVER_URL}/admin/users/${memberId}/reviews`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then(setReviews);
    }
  }, [tab, memberId]);

  const changeStatus = async () => {
    await fetch(`${SERVER_URL}/admin/users/${memberId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    alert("상태 변경 완료");
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
        <div>
          <p>아이디: {user.userId}</p>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>가입일: {dayjs(user.createdAt).format("YYYY-MM-DD")}</p>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-3 py-2 mt-4"
          >
            <option value="ACTIVE">정상</option>
            <option value="BLOCK">차단</option>
            <option value="WITHDRAW">탈퇴</option>
          </select>

          <button
            onClick={changeStatus}
            className="ml-2 bg-black text-white px-4 py-2"
          >
            변경
          </button>
        </div>
      )}

      {/* 주문 내역 */}
      {tab === "ORDER" && (
        <ul>
          {orders.map((o) => (
            <li key={o.orderId}>
              주문번호 {o.orderId} / {o.orderStatus}
            </li>
          ))}
        </ul>
      )}

      {/* 리뷰 내역 */}
      {tab === "REVIEW" && (
        <ul>
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
