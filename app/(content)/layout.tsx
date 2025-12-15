import { cookies } from "next/headers";
import DefaultLayout from "../_components/DefaultLayout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  console.log(cookieStore.get("accessToken"));

  return <DefaultLayout>{children}</DefaultLayout>;
}
