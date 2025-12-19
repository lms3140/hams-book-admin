import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderList({
  selectedOrder,
  offset,
  currentItems,
  formatOrderId,
}: any) {
  const router = useRouter();

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
      case "DELIVER":
        return "배송중";
      default:
        return status;
    }
  };

  return (
    <div>
      <nav>
        <div className="flex content-center items-center text-center pr-6 pl-6 gap-9 justify-between border-b pb-[10px] pt-[10px]">
          <div className="text-center w-[20px]">no</div>
          <div className="text-center w-[140px]">주문번호</div>
          <div className="text-center w-[80px]">상태</div>
          <div className="text-center w-[86px]">주문일자</div>
          <div className="text-center w-[42px]">주문자</div>
          <div className="text-center w-[200px]">상품</div>
          <div className="text-center w-[85px]">가격</div>
          <div className="text-center w-[50px]">상세</div>
        </div>

        <ul>
          {currentItems.map((order: any, idx: number) => {
            const totalPrice = order.items?.reduce(
              (sum: number, item: any) => sum + item.quantity * item.unitPrice,
              0
            );

            return (
              <li
                key={order.orderId}
                className="flex items-center p-6 gap-9  justify-between border-b border-gray-200 text-center"
              >
                <div className="text-center w-[20px]">{offset + idx + 1}</div>
                <div className="text-center  w-[140px]">
                  {formatOrderId(order.paidAt, order.orderId)}
                </div>
                <div className="text-center  w-[80px]">
                  {formatStatus(order.orderStatus)}
                </div>
                <div className="text-center  w-[86px]">
                  {dayjs(order.paidAt).format("YYYY-MM-DD")}
                </div>
                <div className="text-center w-[42px]">
                  {order.address.recipientName}
                </div>
                <div className="text-center w-[200px] ">
                  {order.items?.[0]?.title}
                  {order.items.length > 1 && (
                    <span className="font-semibold">
                      {" "}
                      외 {order.items.length - 1}건
                    </span>
                  )}
                </div>
                <div className="text-center w-[85px]">
                  총 {totalPrice.toLocaleString()}원
                </div>
                <button
                  onClick={() => router.push(`/order/${order.orderId}`)}
                  className="text-center  w-[50px] cursor-pointer underline"
                >
                  상세
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
