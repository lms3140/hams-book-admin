import Link from "next/link";
import LoginForm from "./_components/Auth/LoginForm";

export default async function Home() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
