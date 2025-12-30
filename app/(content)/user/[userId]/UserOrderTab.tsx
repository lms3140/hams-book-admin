"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

export default function UserOrderTab({ userId }: { userId: string }) {
  const router = useRouter();
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${SERVER_URL}/admin/users/${userId}/orders`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error();
        setOrders(await res.json());
      } catch {
        Swal.fire("오류", "주문 내역을 불러오지 못했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

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

  const formatOrderId = (paidAt: string | null, id: number) => {
    const date = paidAt
      ? new Date(paidAt).toISOString().slice(0, 10).replace(/-/g, "")
      : "00000000";
    return `${date}-${String(id).padStart(6, "0")}`;
  };

  return (
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
                (sum: number, item: any) =>
                  sum + item.quantity * item.unitPrice,
                0
              );

              return (
                <tr
                  key={order.orderId}
                  className="text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/order/${order.orderId}`)}
                >
                  <td className="border p-2">{idx + 1}</td>
                  <td className="border p-2">
                    {formatOrderId(order.paidAt, order.orderId)}
                  </td>
                  <td className="border p-2">
                    {formatStatus(order.orderStatus)}
                  </td>
                  <td className="border p-2">
                    {order.paidAt?.slice(0, 10)}
                  </td>
                  <td className="border p-2 text-left">
                    {order.items?.[0]?.title}
                    {order.items?.length > 1 &&
                      ` 외 ${order.items.length - 1}건`}
                  </td>
                  <td className="border p-2">
                    {totalPrice?.toLocaleString()}원
                  </td>
                  <td className="border p-2">
                    <button
                      className="underline"
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
  );
}
