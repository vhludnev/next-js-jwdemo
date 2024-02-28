"use client";

import { useState, useEffect, useRef, SyntheticEvent } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FcKey, VscSignOut, BiMenu, TbTrolley, TbUsers } from "@/lib/icons";
import ThemeSwitcher from "./ThemeSwitcher";
import { permissionClient } from "@/utils";
import ProfilePopup from "./popups/ProfilePopup";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

const Nav = ({ session }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const closeNavBar = () => setToggleDropdown(false);

  const pathname = usePathname();

  const activeStyle = (path: string) =>
    pathname == path
      ? "nav_btn cursor-default"
      : "text-gray-700 hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-400";

  useEffect(() => {
    let handler = (e: MouseEvent): void => {
      if (
        e.target instanceof HTMLElement &&
        !menuRef.current?.contains(e.target) &&
        !burgerRef.current?.contains(e.target)
      ) {
        setToggleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <nav className="z-20 w-full flex items-center justify-between md:pl-3 h-14 md:h-16">
      <div>
        <Link href="/" onClick={closeNavBar}>
          <Image
            src="/icons/logo50.png"
            alt="logo"
            width={34}
            height={34}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="-mr-2 md:mr-0">
        <div className={`flex relative ${toggleDropdown ? "active" : ""}`}>
          <div
            ref={burgerRef}
            className={`z-50 rounded-full p-1.5 bg-primary-white transition-all duration-300 ease-in-out ${
              toggleDropdown
                ? "dark:bg-slate-600"
                : "dark:bg-transparent delay-300"
            }`}
          >
            <BiMenu
              size={36}
              color="dodgerblue"
              className={toggleDropdown ? "dark:text-white" : "text-[#1e90ff]"}
              cursor="pointer"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />
          </div>

          <div className="dropdown z-40" ref={menuRef}>
            <div
              className={`item ${
                session?.user ? "animation-delay-1000" : "animation-delay-700"
              } animation-duration-1000 h-6 md:h-8 mx-auto`}
            >
              <ThemeSwitcher />
            </div>
            {session?.user && (
              <>
                <p className="item animation-delay-200 text-sm font-inter font-medium text-gray-700 dark:text-gray-300">
                  Здравствуй,{" "}
                </p>
                <div className="item animation-delay-200 -mt-2 text-sm font-inter font-medium text-gray-700 dark:text-gray-300">
                  {session.user?.name?.split(" ")[0] || "Возвещатель"}
                </div>
                <div className="item animation-delay-200">
                  <ProfilePopup data={session.user} />
                </div>
              </>
            )}
            {permissionClient("publisher", session?.user) && (
              <>
                <hr className="item w-full animation-delay-300" />
                <Link
                  href="/stand"
                  className={`item animation-delay-400 dropdown_link ${activeStyle(
                    "/stand"
                  )}`}
                  onClick={closeNavBar}
                >
                  Стенды
                  <TbTrolley size={22} color="lightgreen" />
                </Link>
              </>
            )}
            {permissionClient("admin", session?.user) && (
              <Link
                href="/users"
                prefetch={false}
                className={`item animation-delay-500 dropdown_link ${activeStyle(
                  "/users"
                )}`}
                onClick={closeNavBar}
              >
                Список
                <TbUsers size={20} className="text-red-400" />
              </Link>
            )}
            <hr
              className={`item w-full ${
                session?.user ? "animation-delay-600" : "animation-delay-300"
              }`}
            />
            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  closeNavBar();
                  signOut({
                    callbackUrl: "/auth",
                  });
                }}
                className="item animation-delay-700 mt-3"
              >
                <VscSignOut
                  size={20}
                  className="text-gray-700 hover:text-orange-500 dark:text-gray-300"
                />
              </button>
            ) : (
              <Link
                href="/auth"
                prefetch={false}
                className="item animation-delay-400 text-sm font-inter font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 flex gap-1"
                onClick={closeNavBar}
              >
                Войти
                <FcKey size={20} color="lightsalmon" cursor="pointer" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
