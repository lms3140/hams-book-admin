"use client";

import dayjs from "dayjs";

export function OrderDetail({ order }: any) {
  const formatOrderId = (paidAt: string | Date, id: number) => {
    const date = dayjs(paidAt).format("YYYYMMDD");
    const serial = String(id).padStart(6, "0");
    return `${date}-${serial}`;
  };

  return (
    <div>
      <h1>주문상세 ({formatOrderId(order.paidAt, order.orderId)})</h1>

      <div>
        <h3>주문상태</h3>
        <p>{order.status}</p>
      </div>

      <div>
        <div>
          <h3>주문자 정보</h3>
          <p>주문자명 : {order.name}</p>
          <p>연락처 : {order.phone}</p>
        </div>

        <div>
          <h3>배송지 정보</h3>
          <p>수령인 : {order.receiverName}</p>
          <p>수령인 연락처 : {order.phone}</p>
          <p>주소 : {order.address}</p>
        </div>
      </div>

      <div>
        <h3>주문 상품 정보</h3>
        {order.map(() => (
          <div key={order.orderId}>
            <div>1</div>
            <div>{order.title}</div>
            <div>수량 : {order.quantity}</div>
            <div>{order.price.toLocaleString()}원</div>
          </div>
        ))}

        <div>
          <h3>총 주문 금액</h3>
          <p>상품금액 : {order.originalAmount.toLocaleString()}원</p>
          <p>
            배송비 :{" "}
            {(order.originalAmount > 30000 ? "0" : "3000").toLocaleString()}원
          </p>
          <p>
            총 결제금액 :{" "}
            {(order.originalAmount > 30000
              ? order.originalAmount
              : order.originalAmount + 3000
            ).toLocaleString()}
            원
          </p>
        </div>
      </div>
    </div>
  );
}
