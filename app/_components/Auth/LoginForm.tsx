"use client";

import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

type LoginFormData = {
  userId: string;
  pwd: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const handleLogin = async (formData: LoginFormData) => {
    const resp = await fetch("http://localhost:8080/member/login-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
      credentials: "include",
    });
    const data = await resp.json();
    Swal.fire({
      title: "로그인 성공",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    redirect("/book");
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <label htmlFor="userId">아이디</label>
      <input {...register("userId")} type="text" id="userId" />
      <label htmlFor="pwd">비밀번호</label>
      <input {...register("pwd")} type="password" id="pwd" />
      <button type="submit">로그인</button>
    </form>
  );
}
