import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/session";
import { permission } from "../lib/permissions";

const Home = async () => {
  const session = await getCurrentUser();

  if (!session) return redirect("/auth");

  return (
    <section className="xxs:w-full sm:w-10/12 lg:w-9/12 grid grid-cols-[190px] xxs:grid-cols-autoSquares justify-center px-5 mt-4 md:mt-6 gap-x-6 sm:gap-x-20 lg:gap-x-24 gap-y-8 md:gap-y-20">
      <div className="sm:min-w-[12rem] md:min-w-[12rem]">
        <h2 className="font-satoshi font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-2 sm:mb-4 lg:mb-6">
          Стенды
        </h2>
        <div className="my-0 mx-auto sm:p-2.5 rounded-2xl sm:border-4 border-gray-600 dark:border-gray-400 cursor-pointer">
          <Link href="/stand" className="cursor-none md:cursor-pointer">
            <div className="lg:-mr-2.5 rounded-2xl lg:rounded-l-2xl lg:rounded-r hover:bg-[#f7f382] transition ease-in-out duration-200">
              <div className="w-full lg:w-auto max-w-[22rem] rounded-2xl border-2 md:border-4 border-gray-600 dark:border-gray-400 p-7 sm:p-8 md:p-8 lg:-mr-4.5">
                <img
                  width={194}
                  height={194}
                  src="/icons/trolley.svg"
                  alt="trolley"
                  className="main-icon lg:pr-3"
                />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {permission("admin", session?.user) && (
        <div className="sm:min-w-[12rem] md:min-w-[12rem]">
          <h2 className="font-satoshi font-semibold text-center text-xl sm:text-2xl md:text-3xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-2 sm:mb-4 lg:mb-6">
            Список
          </h2>
          <div className="my-0 mx-auto sm:p-2.5 rounded-2xl sm:border-4 border-gray-600 dark:border-gray-400 cursor-pointer relative">
            <Link
              href="/users"
              prefetch={false}
              className="cursor-none md:cursor-pointer"
            >
              <div className="lg:-mr-2.5 rounded-2xl lg:rounded-l-2xl lg:rounded-r hover:bg-[#82f7eb] transition ease-in-out duration-200">
                <div className="w-full lg:w-auto max-w-[22rem] rounded-2xl border-2 md:border-4 border-gray-600 dark:border-gray-400 p-7 sm:p-8 md:p-8 lg:-mr-4.5">
                  <img
                    width={194}
                    height={194}
                    src="/icons/users.svg"
                    alt="users"
                    className="main-icon lg:pr-3"
                  />
                </div>
              </div>
              <span className="absolute top-3 sm:top-6 right-3 sm:right-6 lg:right-2 w-5 sm:w-6">
                <img width={24} height={24} alt="bust" src="/icons/elder.svg" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
