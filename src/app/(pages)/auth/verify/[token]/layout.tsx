import type { ReactNode } from "react";

export const metadata = {
  title: "Проверка | JW Centrs",
};

type Props = {
  children: ReactNode;
};

export default function VerifySignupTokenLayout({ children }: Props) {
  return (
    <div className="flex flex-col justify-center min-h-[70vh] w-full bg-primary-white">
      {children}
    </div>
  );
}
