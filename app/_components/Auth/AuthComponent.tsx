"use client";

import { getClientFetch } from "@/app/_lib/api/client/fetch";
import { SERVER_URL } from "@/app/_lib/api/common/config";
import { useEffect } from "react";

export default function AuthComponent() {
  useEffect(function getMember() {
    (async () => {
      const res = await getClientFetch(`${SERVER_URL}/member/me-cookie`);
      console.log(res.data);
    })();
  });
  return <></>;
}
