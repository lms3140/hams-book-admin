"use client";

export default function UserStatusSection({ user }: { user: any }) {
  const unblock = async () => {
    await fetch(`/admin/users/${user.memberId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status: "ACTIVE",
        reason: null,
      }),
    });

    alert("차단 해제 완료");
    location.reload();
  };

  if (user.status !== "BLOCK") return null;

  return (
    <section className="border p-4 bg-red-50">
      <h3 className="font-bold text-red-600">차단된 회원</h3>
      <p className="mt-2">사유: {user.blockReason}</p>

      <button
        onClick={unblock}
        className="mt-3 underline text-sm"
      >
        차단 해제
      </button>
    </section>
  );
}
