import { useState } from "react";
import { useSession } from "next-auth/react";
import PopupWrapper from "./PopupWrapper";
import { BsTrash, RxUpdate, FcGoogle, AiOutlineGoogle } from "@/lib/icons";
import { permissionClient } from "@/utils";
import ConfirmPopup from "./ConfirmPopup";
import { TUser } from "@/types/user";

const statusMsg = (status: TUser["status"]) => {
  switch (status) {
    case "admin":
      return "присвоить ПОЛНЫЙ доступ";
    default:
      return "убрать ПОЛНЫЙ доступ";
  }
};

type Props = {
  popupData: TUser;
  closeModal: () => void;
  updateUserInfo: (id: TUser["id"], newInfoObj: Partial<TUser>) => void;
  removeUser: (id: TUser["id"]) => void;
};

const UserMainPopup = ({
  popupData,
  closeModal,
  updateUserInfo,
  removeUser,
}: Props) => {
  const [publisherName, setPublisherName] = useState(popupData?.name);
  const [publisherEmail, setPublisherEmail] = useState(popupData?.email);

  const { data: session } = useSession();

  const newProvider =
    popupData?.provider === "google" ? "credentials" : "google";

  return (
    <PopupWrapper
      open={!!popupData}
      closeOnDocumentClick={false}
      onClose={closeModal}
      nested
      lockScroll
    >
      <div className="modal w-[350px] -ml-[175px] -top-[240px] fullheight">
        {permissionClient("admin", session?.user) && (
          <ConfirmPopup
            handleConfirm={() => removeUser(popupData.id)}
            text="Вы уверены, что хотели бы удалить эту учётную запись?"
            top="-top-[149px]"
            btnClass="danger hover:bg-red-700"
            nested={true}
            button={
              <button className="absolute left-5 top-[1.1rem] outline-none">
                <BsTrash
                  size={20}
                  className="text-gray-400 hover:text-red-700 transition ease-in-out duration-250"
                />
              </button>
            }
          />
        )}
        <button className="close" onClick={closeModal}>
          &times;
        </button>
        {popupData && (
          <>
            <div className="header text-center dark:text-white">
              Обновить данные
            </div>
            <div className="content">
              <div className="relative">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody className="dark:filter dark:brightness-90">
                    <tr className="bg-white border-b dark:border-gray-400">
                      <th
                        scope="row"
                        className="p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]"
                      >
                        Имя
                      </th>
                      <td className="p-4 relative">
                        <input
                          type="text"
                          name="name"
                          placeholder="Имя, Фамилия"
                          value={publisherName}
                          required
                          minLength={3}
                          className="pr-5 mb-0 max-w-[190px] text-sm font-normal placeholder:text-sm dark:focus:text-black dark:w-[95%]"
                          onChange={(e) => setPublisherName(e.target.value)}
                        />
                        {publisherName !== popupData?.name && (
                          <ConfirmPopup
                            handleConfirm={() =>
                              publisherName &&
                              updateUserInfo(popupData.id, {
                                name: publisherName,
                              })
                            }
                            text={`Вы уверены, что хотели бы сменить имя возвещателю на ${publisherName}?`}
                            top="-top-[165px]"
                            nested={true}
                            button={
                              <span className="absolute top-1/2 -translate-y-1/2 right-2 bg-white border-2 border-gray-100 rounded-full p-1">
                                <RxUpdate
                                  cursor="pointer"
                                  className="text-green-600 hover:text-green-400 transition ease-in-out duration-500"
                                  size={14}
                                />
                              </span>
                            }
                          />
                        )}
                      </td>
                    </tr>

                    <tr
                      className={`bg-white ${
                        popupData?.verified
                          ? "border-b dark:border-gray-400"
                          : ""
                      }`}
                    >
                      <th
                        scope="row"
                        className="p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]"
                      >
                        Эл.почта
                      </th>
                      <td className="p-4 relative">
                        <input
                          type="text"
                          name="email"
                          placeholder="Эл. почта"
                          value={publisherEmail}
                          required
                          minLength={3}
                          className="pr-5 mb-0 max-w-[190px] text-sm font-normal placeholder:text-sm dark:focus:text-black dark:w-[95%]"
                          onChange={(e) => setPublisherEmail(e.target.value)}
                        />
                        {publisherEmail !== popupData?.email && (
                          <ConfirmPopup
                            handleConfirm={() =>
                              publisherEmail &&
                              updateUserInfo(popupData.id, {
                                email: publisherEmail,
                              })
                            }
                            text={`Вы уверены, что хотели бы сменить адрес эл. почты возвещателю ${publisherName} на ${publisherEmail}?`}
                            top="-top-[165px]"
                            nested={true}
                            button={
                              <span className="absolute top-1/2 -translate-y-1/2 right-2 bg-white border-2 border-gray-100 rounded-full p-1">
                                <RxUpdate
                                  cursor="pointer"
                                  className="text-green-600 hover:text-green-400 transition ease-in-out duration-500"
                                  size={14}
                                />
                              </span>
                            }
                          />
                        )}
                        {popupData?.email.split("@")[1] === "gmail.com" && (
                          <ConfirmPopup
                            handleConfirm={() =>
                              updateUserInfo(
                                popupData.id,
                                { provider: newProvider }
                                //newProvider
                              )
                            }
                            text={`Вы уверены, что хотели бы ${
                              popupData.provider === "google"
                                ? "отключить"
                                : "активировать"
                            } Гугл кнопку для ${publisherEmail}?`}
                            warning={
                              popupData.provider === "google"
                                ? "Вход в систему станет возможным только через форму авторизации!"
                                : "Вход в систему через Пароль станет невозможным!"
                            }
                            top="-top-[149px]"
                            nested={true}
                            button={
                              <span className="absolute top-1/2 -translate-y-1/2 -right-2.5 bg-white dark:border border-gray-100 rounded-full p-0.5">
                                {popupData?.provider === "google" ? (
                                  <FcGoogle cursor="pointer" size={15} />
                                ) : (
                                  <AiOutlineGoogle
                                    cursor="pointer"
                                    size={15}
                                    color="lightgray"
                                  />
                                )}
                              </span>
                            }
                          />
                        )}
                      </td>
                    </tr>

                    {popupData?.verified && (
                      <tr className="bg-white">
                        <th
                          scope="row"
                          className="p-4 font-medium text-gray-900 whitespace-nowrap max-w-[106px]"
                        >
                          Доступ
                        </th>
                        <td className="p-4 text-base">
                          {popupData.status === "admin" ? (
                            <span className="font-semibold text-[green]">
                              Полный
                            </span>
                          ) : (
                            <span className="font-medium text-[grey]">——</span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        <div className="actions flex-col gap-2">
          {popupData?.verified ? (
            <>
              <div className="flex gap-2">
                <ConfirmPopup
                  handleConfirm={() =>
                    updateUserInfo(popupData.id, { status: "admin" })
                  }
                  text={`Вы уверены, что хотели бы ${statusMsg("admin")}?`}
                  top="-top-[149px]"
                  nested={true}
                  button={
                    <button
                      className="button success hover:bg-green-600 transition ease-in-out duration-250 min-w-[95px]"
                      disabled={popupData.status === "admin"}
                    >
                      Полный
                    </button>
                  }
                />

                <ConfirmPopup
                  handleConfirm={() =>
                    updateUserInfo(popupData.id, { status: "user" })
                  }
                  text={`Вы уверены, что хотели бы ${statusMsg("user")}?`}
                  top="-top-[149px]"
                  btnClass="danger hover:bg-red-700"
                  nested={true}
                  button={
                    <button
                      disabled={popupData.status === "user"}
                      className="button danger hover:bg-red-600  transition ease-in-out duration-350 min-w-[95px]"
                    >
                      Убрать
                    </button>
                  }
                />
              </div>
            </>
          ) : (
            <ConfirmPopup
              handleConfirm={() =>
                updateUserInfo(popupData.id, { verified: true })
              }
              text="Вы уверены, что хотели бы этому возвещателю дать доступ к сайту?"
              top="-top-[149px]"
              nested={true}
              button={
                <button className="button success hover:bg-green-600 transition ease-in-out duration-250 min-w-[95px]">
                  Подтветдить
                </button>
              }
            />
          )}
        </div>
      </div>
    </PopupWrapper>
  );
};

export default UserMainPopup;
