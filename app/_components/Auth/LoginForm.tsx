"use client";

import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/app/_lib/api/common/config";

type LoginFormData = {
  userId: string;
  pwd: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const handleLogin = async (formData: LoginFormData) => {
    const resp = await fetch(`${SERVER_URL}/member/login-cookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
      credentials: "include",
    });
    const data = await resp.json();
    console.log(data);
    if (data.login) {
      Swal.fire({
        title: "로그인 성공",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      redirect("/book");
    } else {
      Swal.fire({
        title: "실패",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">
          로그인
        </h1>

        <div className="mb-4">
          <label
            htmlFor="userId"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            아이디
          </label>
          <input
            {...register("userId")}
            type="text"
            id="userId"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="pwd"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            비밀번호
          </label>
          <input
            {...register("pwd")}
            type="password"
            id="pwd"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800
                     focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white
                   hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
