import type { ReactNode } from "react";

export const metadata = {
  title: "Служение со стендами | JW Centrs",
};

type Props = {
  children: ReactNode;
};

export default function StandLayout({ children }: Props) {
  return (
    <section className="w-full flex-center flex-col relative sm:container">
      {children}
    </section>
  );
}
