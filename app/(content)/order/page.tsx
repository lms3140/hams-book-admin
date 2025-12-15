"use client";

import { useEffect, useState } from "react";
import { OrderList } from "./OrderList";
import { usePagination } from "@/app/_store/usePagination";
import Pagination from "@/app/_components/Pagination/Pagination";
import dayjs from "dayjs";

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8080/admin/orders/list", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    // console.log("data :: ", data);
    setOrders(data);
  };

  const fetchOrderDetail = (orderId: number) => {
    const found = orders.find((o) => o.orderId === orderId);
    setSelectedOrder(found);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatOrderId = (paidAt: string | Date, id: number) => {
    const date = dayjs(paidAt).format("YYYYMMDD");
    const serial = String(id).padStart(6, "0");
    return `${date}-${serial}`;
  };

  //페이지네이션
  const { currentPage, pageCount, currentItems, handlePageChange, offset } =
    usePagination(orders, 10);

  return (
    <div className="p-[30px]">
      <div className="pb-[10px] border-b ">
        <h1 className="text-4xl pb-[20px]">주문/배송 관리</h1>
        <div className="flex gap-[5px]">
          <h3>총 주문건수</h3>
          <p>
            <span className="text-[#3c9a17] font-bold">
              {currentItems.length}
            </span>
            건
          </p>
        </div>
      </div>

      {/* <OrderFilter /> */}

      <OrderList
        orders={orders}
        selectedOrder={fetchOrderDetail}
        offset={offset}
        currentItems={currentItems}
        formatOrderId={formatOrderId}
      />

      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
