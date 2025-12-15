import Link from "next/link";

export default async function Home() {
  return (
    <div className="w-lvw h-lvh flex justify-center items-center">
      <div className="flex gap-4">
        <Link
          className="text-center border-3 border-cyan-200 rounded-4xl p-2 w-28 bg-cyan-100 hover:bg-cyan-200"
          href={"/login"}
        >
          로그인
        </Link>
        <Link
          className="text-center border-3 border-cyan-200 rounded-4xl p-2 w-28 bg-cyan-100 hover:bg-cyan-200"
          href={"/order"}
        >
          주문
        </Link>
        <Link
          className="text-center border-3 border-cyan-200 rounded-4xl p-2 w-28 bg-cyan-100 hover:bg-cyan-200"
          href={"/user"}
        >
          유저
        </Link>
        <Link
          className="text-center border-3 border-cyan-200 rounded-4xl p-2 w-28 bg-cyan-100 hover:bg-cyan-200"
          href={"/book"}
        >
          책
        </Link>
      </div>
    </div>
  );
}
