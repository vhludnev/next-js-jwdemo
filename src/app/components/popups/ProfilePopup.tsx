import Image from "next/image";
import { BsFillPersonFill } from "@/lib/icons";
import moment from "moment";
import type { TUser } from "@/types/user";
import Modal from "./Modal";
import type { TRoundedSize } from "@/types/modal";
import { cc, rounded } from "@/utils";
import "moment/locale/ru";

moment.locale("ru");

const ProfilePopup = ({
  data,
  roundedSize,
}: {
  data: TUser;
  roundedSize?: TRoundedSize;
}) => {
  return (
    <Modal
      closeOnDocumentClick={false}
      trigger={
        <div className="cursor-pointer">
          {data?.image ? (
            <Image
              src={data.image}
              width={37}
              height={37}
              className="rounded-full"
              alt="profile"
            />
          ) : (
            <BsFillPersonFill color="#6992ca" size={26} />
          )}
        </div>
      }
      roundedSize={roundedSize}
    >
      {
        (() => (
          <>
            <div
              className={cc(
                "header",
                rounded("t", roundedSize),
                "bg-primary-white h-14 dark:bg-[#454b4d]"
              )}
            ></div>
            <div
              className={cc(
                "content",
                rounded("b", roundedSize),
                "px-0 md:px-2 py-2 bg-primary-white dark:bg-[#454b4d] -mt-0.5"
              )}
            >
              <div className="text-base relative px-2 pb-7 overflow-x-hidden max-h-[300px] md:max-h-[50vh] w-[350px] flex flex-col items-center gap-2">
                <div className="pb-6">
                  {data?.image ? (
                    <Image
                      src={data.image}
                      width={70}
                      height={70}
                      className="rounded-full"
                      alt="profile"
                    />
                  ) : (
                    <BsFillPersonFill color="#6992ca" size={70} />
                  )}
                </div>
                <div className="text-lg long_text dark:text-gray-100">
                  {data.name}
                </div>
                <div className="long_text dark:text-gray-100 pb-4">
                  {data.email}
                </div>
              </div>
            </div>
          </>
        )) as unknown as React.ReactNode
      }
    </Modal>
  );
};

export default ProfilePopup;
