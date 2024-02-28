"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TbLoader } from "@/lib/icons";

const DefaultResetPassword = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();

    const email = emailInputRef.current?.value.trim();
    try {
      setLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { error, data } = await response.json();

      if (error) {
        setLoading(false);
        toast.error(error, { autoClose: 2000 });
      }

      if (data) {
        toast.success("Проверьте вашу эл. почту!", { autoClose: 2000 });
      }

      setLoading(false);
      setTimeout(() => router.push("/auth"), 2000);
      return;
    } catch (error) {
      setLoading(false);
      toast.error("Ошибка! Что-то пошло не так");
      setTimeout(() => router.push("/auth"), 2000);
      return;
    }
  };

  return (
    <>
      <h1 className="text-center mb-4">
        <span className="blue_gradient">Забыли пароль</span>
      </h1>
      <form onSubmit={handleForgot}>
        <div className="mb-2">
          <label className="block mb-2 font-bold" htmlFor="email">
            Электронная почта
          </label>
          <input
            className="auth_form_input px-3 text-center tracking-wider"
            type="text"
            id="email"
            ref={emailInputRef}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col items-center mt-6">
          <button
            disabled={loading}
            className={
              !loading
                ? "text-white rounded px-10 py-2 bg-[#6992ca] border-[#6992ca] hover:bg-[#3171c9] hover:border-[#3171c9]"
                : "p-1 outline-none"
            }
          >
            {loading ? (
              <TbLoader
                size={32}
                color="#3171c9"
                className="animate-spin-slow"
              />
            ) : (
              "Сбросить пароль"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default DefaultResetPassword;
