"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { TbLoader } from "@/lib/icons";
import Spinner from "@/components/Spinner";

const ResetPassword = () => {
  const passInputRef = useRef<HTMLInputElement>(null);
  const passConfInputRef = useRef<HTMLInputElement>(null);
  const toastId = useRef<any>();

  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(false);

  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setCheckingToken(true);
      if (!token || token.length < 100) {
        return router.push("/auth/forgot-password");
      }

      const response = await fetch(`/api/auth/reset-password/${token}`);

      const { error, data } = await response.json();

      if (data) {
        setTokenIsValid(!!data);
      }

      if (error) {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(error);
        }
        setTimeout(() => router.push("/auth/forgot-password"), 2000);
      }
      return setCheckingToken(false);
    })();
  }, []);

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();

    const password = passInputRef.current?.value;
    const confPassword = passConfInputRef.current?.value;

    if (password !== confPassword) {
      toast.error("Проверьте, совпадают ли пароли.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const { error, data } = await response.json();
      if (data) {
        setLoading(false);
        toast.success("Пароль изменён успешно!");

        setTimeout(() => router.push("/auth"), 500);
        return;
      }

      if (error) {
        setLoading(false);
        toast.error(error);
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Ошибка! Что-то пошло не так");
      return;
    }
  };

  if (checkingToken) {
    return <Spinner wrapper />;
  }

  if (!token || !tokenIsValid) {
    return null;
  }

  return (
    <>
      <h1 className="text-center mb-4">
        <span className="blue_gradient">Смена пароля</span>
      </h1>

      <form onSubmit={resetPassword}>
        <div className="mb-2">
          <label className="block mb-2 font-bold" htmlFor="password">
            Новый пароль
          </label>
          <div className="relative">
            <input
              className="auth_form_input pl-8 pe-8 text-center tracking-wider"
              type="password"
              id="password"
              ref={passInputRef}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block mb-2 font-bold" htmlFor="confPassword">
            Подтвердите пароль
          </label>
          <div className="relative">
            <input
              className="auth_form_input pl-8 pe-8 text-center tracking-wider"
              type="password"
              id="confPassword"
              ref={passConfInputRef}
              autoComplete="new-password"
            />
          </div>
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
              "Сохранить"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
