"use client";

import { useEffect, useState } from "react";
import { OrderFilter } from "./OrderFilter";
import { OrderList } from "./OrderList";
import { OrderDetail } from "./OrderDetail";
import Pagination from "../_components/Pagination/Pagination";
import { usePagination } from "../_store/usePagination";

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // const fetchOrders = async () => {
  //   // const token = localStorage.getItem("jwtToken");
  //   const res = await fetch("http://localhost:8080/order-history/get", {
  //     method: "GET",
  //     headers: {
  //       // Authorization: `Bearer ${token}`,
  //     },
  //     cache: "no-store",
  //   });
  //   const data = await res.json();
  //   setOrders(data);
  // };

  const fetchOrderDetail = (orderId: number) => {
    const found = orders.find((o) => o.orderId === orderId);
    setSelectedOrder(found);
  };

  useEffect(() => {
    // fetchOrders();
  }, []);

  //페이지네이션
  const { currentPage, pageCount, currentItems, handlePageChange, offset } =
    usePagination(orders, 10);

  return (
    <div>
      <h1>주문/배송 관리</h1>

      <OrderFilter />

      <OrderList
        orders={orders}
        selectedOrder={fetchOrderDetail}
        offset={offset}
        currentItems={currentItems}
      />

      {selectedOrder && <OrderDetail order={selectedOrder} />}

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
