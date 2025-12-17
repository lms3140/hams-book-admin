import Link from "next/link";
import { Header } from "./Layout/Header";
import { Menu } from "./Layout/Menu";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <div className="border-r border-gray-200 w-2xs min-w-2xs">
        <div className="h-20 border-b border-gray-200 flex justify-center">
          <Link href={"/"}>
            <img src="/images/logo.png" alt="logo" className="h-full" />
          </Link>
        </div>
        <div>
          <Menu />
        </div>
      </div>
      <div className="flex-1 min-w-3xl h-dvh flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
