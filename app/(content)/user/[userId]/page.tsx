"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

type TabType = "INFO" | "ORDER" | "REVIEW";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [reviews, setReviews] = useState<any[] | null>(null);
  const [tab, setTab] = useState<TabType>("INFO");
  const [loading, setLoading] = useState(false);

  // ===== 회원 정보 =====
  const fetchUser = async () => {
    if (!userId) return;
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

  // ===== 탭별 데이터 로딩 =====
  useEffect(() => {
    if (!userId) return;

    const fetchTabData = async () => {
      setLoading(true);
      try {
        if (tab === "ORDER" && orders === null) {
          const res = await fetch(
            `${SERVER_URL}/admin/users/${userId}/orders`,
            { credentials: "include" }
          );
          if (!res.ok) throw new Error();
          setOrders(await res.json());
        }

        if (tab === "REVIEW" && reviews === null) {
          const res = await fetch(
            `${SERVER_URL}/admin/users/${userId}/reviews`,
            { credentials: "include" }
          );
          if (!res.ok) throw new Error();
          setReviews(await res.json());
        }
      } catch {
        Swal.fire("오류", "데이터를 불러오지 못했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, [tab, userId]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (!user) return <div className="p-6">로딩중...</div>;

  // ===== 헬퍼 함수 =====
  const formatStatus = (status: string) => {
    switch (status) {
      case "PAID":
        return "배송준비중";
      case "READY":
        return "결제대기";
      case "DELIVER":
        return "배송중";
      case "CANCEL":
        return "취소";
      case "FAIL":
        return "결제실패";
      default:
        return status;
    }
  };

  const formatOrderId = (paidAt: string | null | undefined, id: number) => {
    const date = paidAt
      ? new Date(paidAt).toISOString().slice(0, 10).replace(/-/g, "")
      : "Invalid Date";
    return `${date}-${String(id).padStart(6, "0")}`;
  };

  return (
    <div className="p-[30px]">
      <h1 className="text-4xl mb-6">회원 상세</h1>

      {/* 탭 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("INFO")}
          className={tab === "INFO" ? "font-bold underline" : ""}
        >
          회원 정보
        </button>
        <button
          onClick={() => setTab("ORDER")}
          className={tab === "ORDER" ? "font-bold underline" : ""}
        >
          주문 내역
        </button>
        <button
          onClick={() => setTab("REVIEW")}
          className={tab === "REVIEW" ? "font-bold underline" : ""}
        >
          리뷰 내역
        </button>
      </div>

      {/* 회원 정보 */}
      {tab === "INFO" && (
        <div className="max-w-md border p-6 rounded space-y-4">
          {/* 상태 수정 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">상태</span>
            <div className="flex flex-col flex-1 gap-2">
              <select
                value={user.status}
                onChange={(e) => setUser({ ...user, status: e.target.value })}
                className="border px-2 py-1"
              >
                <option value="ACTIVE">정상</option>
                <option value="BLOCK">차단</option>
                <option value="WITHDRAW">탈퇴</option>
              </select>
              <input
                type="text"
                placeholder="수정 이유를 입력하세요"
                value={user.statusReason || ""}
                onChange={(e) => setUser({ ...user, statusReason: e.target.value })}
                className="border px-2 py-1"
              />
            </div>
          </div>

          {/* 포인트 수정 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">포인트</span>
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="증감액"
                  value={user.pointChange || ""}
                  onChange={(e) =>
                    setUser({ ...user, pointChange: Number(e.target.value) })
                  }
                  className="border px-2 py-1 w-32"
                />
                <span>현재: {user.pointBalance ?? 0}</span>
              </div>
              <input
                type="text"
                placeholder="수정 이유를 입력하세요"
                value={user.pointReason || ""}
                onChange={(e) => setUser({ ...user, pointReason: e.target.value })}
                className="border px-2 py-1"
              />
            </div>
          </div>

          {/* 기본 정보 표시 */}
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">아이디</span>
            <span>{user.userId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">이름</span>
            <span>{user.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">이메일</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold w-32">가입일</span>
            <span>
              {user.createdAt
                ? new Date(user.createdAt).toISOString().slice(0, 10)
                : "-"}
            </span>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                try {
                  // 상태 수정 API 호출
                  if (user.statusReason) {
                    await fetch(`${SERVER_URL}/admin/users/${userId}/status`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        status: user.status,
                        reason: user.statusReason,
                      }),
                    });
                  }

                  // 포인트 수정 API 호출
                  if (user.pointChange) {
                    await fetch(`${SERVER_URL}/admin/users/${userId}/point`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        amount: user.pointChange,
                        reason: user.pointReason,
                      }),
                    });
                  }

                  Swal.fire("완료", "회원 정보를 업데이트했습니다.", "success");
                  fetchUser(); // 최신 정보 다시 로드
                } catch {
                  Swal.fire("오류", "업데이트 실패", "error");
                }
              }}
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 주문 내역 */}
      {tab === "ORDER" && (
        <>
          {loading && <p>로딩중...</p>}
          {!loading && orders?.length === 0 && <p>주문 내역 없음</p>}

          {!loading && orders && (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 w-[50px]">no</th>
                  <th className="border p-2">주문번호</th>
                  <th className="border p-2">상태</th>
                  <th className="border p-2">주문일</th>
                  <th className="border p-2">상품</th>
                  <th className="border p-2">가격</th>
                  <th className="border p-2">상세</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const totalPrice = order.items?.reduce(
                    (sum: number, item: any) => sum + item.quantity * item.unitPrice,
                    0
                  );

                  return (
                    <tr
                      key={order.orderId}
                      className="text-center cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/order/${order.orderId}`)}
                    >
                      <td className="border p-2 w-[50px]">{idx + 1}</td>
                      <td className="border p-2">
                        {formatOrderId(order.paidAt, order.orderId)}
                      </td>
                      <td className="border p-2">{formatStatus(order.orderStatus)}</td>
                      <td className="border p-2">
                        {order.paidAt
                          ? new Date(order.paidAt).toISOString().slice(0, 10)
                          : "Invalid Date"}
                      </td>
                      <td className="border p-2 text-left">
                        {order.items?.[0]?.title}
                        {order.items?.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </td>
                      <td className="border p-2">
                        {totalPrice ? `총 ${totalPrice.toLocaleString()}원` : "0원"}
                      </td>
                      <td className="border p-2">
                        <button
                          className="underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/order/${order.orderId}`);
                          }}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* 리뷰 내역 */}
      {tab === "REVIEW" && (
        <>
          {loading && <p>로딩중...</p>}
          {!loading && reviews?.length === 0 && <p>리뷰 없음</p>}
          {!loading &&
            reviews?.map((review) => (
              <div
                key={review.reviewId}
                className="border p-3 mb-2 rounded"
              >
                <p className="font-semibold">{review.title}</p>
                <p>평점: ⭐ {review.rating}</p>
                <p className="text-sm text-gray-600">{review.content}</p>
                <p className="text-xs text-gray-400">
                  작성일: {review.createdAt}
                </p>
              </div>
            ))}
        </>
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
