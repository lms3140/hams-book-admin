import { cookies } from "next/headers";
import LoginForm from "../../_components/Auth/LoginForm";

export default async function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
