"use client";

import { useState } from "react";

export default function UserPointSection({ user }: { user: any }) {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  const submit = async () => {
    if (!amount || !reason) {
      alert("변경 금액과 사유를 입력하세요");
      return;
    }

    await fetch(`/admin/users/${user.memberId}/point`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        amount,
        reason,
      }),
    });

    alert("포인트가 변경되었습니다");
    location.reload();
  };

  return (
    <section>
      <h3 className="font-bold mb-2">포인트 관리</h3>

      <p>현재 포인트: {user.pointBalance.toLocaleString()} P</p>

      <input
        type="number"
        placeholder="변경할 포인트"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 mt-2"
      />

      <input
        type="text"
        placeholder="변경 사유"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border p-2 mt-2 w-full"
      />

      <button
        onClick={submit}
        className="mt-3 bg-black text-white px-4 py-2"
      >
        포인트 변경
      </button>
    </section>
  );
}
