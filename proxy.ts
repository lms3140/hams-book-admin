import { NextResponse, type NextRequest } from "next/server";
import { SERVER_URL } from "./app/_lib/api/common/config";

export async function proxy(request: NextRequest) {
  try {
    const res = await fetch(`${SERVER_URL}/member/validate-jwt-cookie`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });
    console.log(res.status);
    if (res.status !== 200) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/book/:path*", "/order/:path*", "/user/:path*"],
};
