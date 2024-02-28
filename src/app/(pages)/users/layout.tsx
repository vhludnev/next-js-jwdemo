import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ToastProvider = dynamic(() => import("@/components/ToastProvider"));

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Список зарегистрированных возвещателей | JW Centrs",
};

export default function AllUsersListLayout({ children }: Props) {
  return (
    <>
      <section className="flex-start flex-col relative">{children}</section>
      <ToastProvider />
    </>
  );
}
