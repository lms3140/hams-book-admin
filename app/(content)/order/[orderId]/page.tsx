"use client";

import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetail() {
  const router = useRouter();
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const res = await fetch(`http://localhost:8080/admin/orders/${orderId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setOrder(data);
    };

    fetchOrderDetail();
  }, [orderId]);

  if (!order) {
    return <div>주문 정보를 불러오는 중입니다...</div>;
  }

  const formatOrderId = (paidAt: string | Date, id: number) => {
    const date = dayjs(paidAt).format("YYYYMMDD");
    const serial = String(id).padStart(6, "0");
    return `${date}-${serial}`;
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "PAID":
        return "배송준비중";
      case "READY":
        return "결제대기";
      case "CANCEL":
        return "취소";
      case "FAIL":
        return "결제실패";
      default:
        return status;
    }
  };

  const totalPrice = order.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="p-[30px]">
      <h1 className="text-4xl pb-[20px]">
        주문상세 ({formatOrderId(order.paidAt, order.orderId)})
      </h1>

      <div className="flex gap-[20px] pb-[30px]">
        <h3 className="font-bold">주문상태</h3>
        <p>{formatStatus(order.orderStatus)}</p>
      </div>

      <div className="pb-[50px]">
        <h3 className="text-2xl">주문 상품 정보</h3>
        <div className="flex content-center pr-10 pl-10 gap-9 justify-between border-b pb-[10px] pt-[10px]">
          <div className="text-center w-[30px]">no</div>
          <div className="text-center w-[300px]">제목</div>
          <div className="text-center w-[30px]">수량</div>
          <div className="text-center w-[80px]">가격</div>
        </div>

        {order.items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center pr-10 pl-10 gap-9 justify-between border-b pb-[10px] pt-[10px] "
          >
            <div className="text-center w-[30px]">{idx + 1}</div>
            <div className="text-center w-[300px]">{item.title}</div>
            <div className="text-center w-[30px]">{item.quantity}</div>
            <div className="text-center w-[80px]">
              {item.unitPrice.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-[12px] p-[20px] mb-[30px]">
        <h3 className="text-2xl">총 주문 금액</h3>
        <p>
          <span className="font-bold">상품금액</span> :{" "}
          {totalPrice.toLocaleString()}원
        </p>
        <p>
          <span className="font-bold">배송비</span> :{" "}
          {(totalPrice > 30000 ? "0" : 3000).toLocaleString()}원
        </p>
        <p>
          <span className="font-bold">총 결제금액</span> :{" "}
          {(totalPrice > 30000
            ? totalPrice
            : totalPrice + 3000
          ).toLocaleString()}
          원
        </p>
      </div>

      <div className="border rounded-[12px] p-[20px]">
        <h3 className="text-2xl">배송지 정보</h3>
        <p>
          <span className="font-bold">수령인</span> :{" "}
          {order.address.recipientName}
        </p>
        <p>
          <span className="font-bold">수령인 연락처</span> :{" "}
          {order.address.phone}
        </p>
        <p>
          <span className="font-bold">주소</span> : [{order.address.zipCode}]{" "}
          {order.address.addressLine1} {order.address.addressLine2}
        </p>
      </div>

      <div className="flex justify-center pt-[30px]">
        <button
          onClick={() => router.push("/order")}
          className="rounded-[10px] w-[200px] h-[50px] bg-[#5055b1] text-white font-bold"
        >
          이전페이지
        </button>
      </div>
    </div>
  );
}
