"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

export default function UserReviewTab({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${SERVER_URL}/admin/users/${userId}/reviews`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();

        setReviews(await res.json());
      } catch {
        Swal.fire("오류", "리뷰 내역을 불러오지 못했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  return (
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

            <p className="text-sm text-gray-600">
              {review.content}
            </p>

            <p className="text-xs text-gray-400">
              작성일:{" "}
              {review.createdAt
                ? review.createdAt.slice(0, 10)
                : "-"}
            </p>
          </div>
        ))}
    </>
  );
}
