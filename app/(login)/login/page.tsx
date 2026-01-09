import { cookies } from "next/headers";
import LoginForm from "../../_components/Auth/LoginForm";

export default async function LoginPage() {
  const cookieStore = (await cookies()).get("accessToken");
  return (
    <div>
      <LoginForm />
    </div>
  );
}
