import PopupWrapper from "./PopupWrapper";
import { PiWarningBold } from "@/lib/icons";

type Props = {
  btnClass?: string;
  text: string;
  warning?: string;
  handleConfirm: () => void;
  top: string;
  closeHeaderBtn?: boolean;
  nested?: boolean;
  lockScroll?: boolean;
  closeOnDocumentClick?: boolean;
  button: React.ReactElement;
  lang?: string;
};

const ConfirmPopup = ({
  btnClass = "success hover:bg-green-600",
  text,
  warning,
  handleConfirm = () => {},
  top = "-top-[165px]",
  closeHeaderBtn = false,
  nested = false,
  lockScroll = false,
  closeOnDocumentClick = true,
  button,
  lang = "ru",
}: Props) => {
  const handleClose = (close: any) => {
    close();
    lockScroll && document.body.style.overflow === "unset";
  };
  return (
    <PopupWrapper
      trigger={button}
      nested={nested}
      modal
      lockScroll={lockScroll}
      closeOnDocumentClick={closeOnDocumentClick}
    >
      {
        ((close: any) => (
          <div
            className={`modal ${
              nested ? "w-[320px] -ml-[160px]" : "w-[344px] -ml-[172px]"
            } ${top} rounded-lg border-2 border-gray-300 drop-shadow-xl`}
          >
            {closeHeaderBtn && (
              <button
                className="close top-3 right-3"
                onClick={() => handleClose(close)}
              >
                &times;
              </button>
            )}
            <div className="header bg-white h-12 dark:bg-[#454b4d]"></div>
            <div className="content pt-0 pb-2 px-6 flex flex-col gap-3.5">
              <span className={`text-base ${warning ? "px-5" : "text-center"}`}>
                {text}
              </span>
              {warning && (
                <span className="flex gap-2">
                  <PiWarningBold color="orangered" size={24} />
                  <b className="text-base self-end">{warning}</b>
                </span>
              )}
            </div>
            <div className="actions bg-white dark:bg-[#454b4d]">
              <button
                className="button w-20 border-[#6992ca] text-[#6992ca] dark:border-blue-300 dark:text-blue-300 dark:hover:text-white hover:text-white hover:bg-[#6992ca] transition ease-in-out duration-250"
                onClick={() => handleClose(close)}
              >
                {lang === "lv" ? "Atcelt" : "Отменить"}
              </button>
              <button
                className={`button min-w-16 ${btnClass} transition ease-in-out duration-250`}
                onClick={() => {
                  handleConfirm();
                  handleClose(close);
                }}
              >
                {lang === "lv" ? "Apstiprināt" : "Подтвердить"}
              </button>
            </div>
          </div>
        )) as unknown as React.ReactNode
      }
    </PopupWrapper>
  );
};

export default ConfirmPopup;
