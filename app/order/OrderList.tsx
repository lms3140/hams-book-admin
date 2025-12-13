import dayjs from "dayjs";

export function OrderList({ selectedOrder, offset, currentItems }: any) {
  return (
    <div>
      <nav>
        <div>
          <div>주문번호</div>
          <div>상태</div>
          <div>주문일자</div>
          <div>주문자</div>
          <div>상품</div>
          <div>가격</div>
          <div>상세</div>
        </div>

        {/* 주문내역 map */}
        <ul>
          {currentItems.map((order: any, idx: number) => (
            <li key={order.orderId}>
              <div>{offset + idx + 1}</div>
              <div>{order.orderId}</div>
              <div>{order.status}</div>
              <div>{order.orderDate}</div>
              <div>{dayjs(order.paidAt).format("YYYY-MM-DD")}</div>
              <img src={order.imageUrl} alt={order.title} />
              <div>{order.title}</div>
              <div>{order.price.toLocaleString()}원</div>
              <button onClick={() => selectedOrder(order.orderId)}>상세</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
