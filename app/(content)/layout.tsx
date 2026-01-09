import AuthComponent from "../_components/Auth/AuthComponent";
import DefaultLayout from "../_components/DefaultLayout";
import { SERVER_URL } from "../_lib/api/common/config";
import { getServerFetch } from "../_lib/api/server/fetch";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <>{children}</>
    </DefaultLayout>
  );
}
