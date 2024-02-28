import { useState } from "react";
import { capitalizeString, resourceMap } from "@/utils";
import { AREA } from "@/constants";
import Notification from "../Notification";
import { usePrevious } from "@/hooks/usePrevious";
import PopupWrapper from "./PopupWrapper";
import ConfirmPopup from "./ConfirmPopup";
import { EventPopupProps, TEvent } from "@/types/event";

type StateProps = {
  title: string;
  name1: string;
  name2: string;
};

const ControlledPopup = ({
  open,
  closeModal,
  data,
  moment,
  handleSave,
  handleDelete,
  message,
}: EventPopupProps) => {
  if (!data) return;

  const { id, title, start, end, name1, name2, resourceId } = data as TEvent;

  const [state, setState] = useState<StateProps>({
    title: title || "",
    name1: name1 || "",
    name2: name2 || "",
  });

  const dataToSave: TEvent = {
    ...state,
    start,
    end,
    id,
    resourceId:
      (state.title &&
        resourceMap.filter((r) => r.resourceTitle === state.title)[0]
          .resourceId) ||
      resourceId,
  };

  const handleStateChange = (
    evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const saveHandler = async () => {
    if (state.name1 && state.name2 && state.title) {
      await handleSave(dataToSave);
    }
  };

  const stateChanged = usePrevious(state);

  return (
    <div>
      <PopupWrapper
        open={open}
        closeOnDocumentClick={false}
        onClose={closeModal}
        modal
        nested
        lockScroll
      >
        <div className="modal w-[350px] -ml-[175px] -top-[165px]">
          <button className="close" onClick={closeModal}>
            &times;
          </button>
          <div className="header">
            <select
              required
              value={state.title}
              name="title"
              onChange={handleStateChange}
            >
              <option value="">Выберите место</option>
              {AREA.map((a) => (
                <option key={a.id} value={a.title}>
                  {a.title}
                </option>
              ))}
            </select>

            <span>
              {`${capitalizeString(moment(start).format("dd DD.MM.YYYY "))}`}
              &#128337;
              {`${moment(start).format(" HH:mm")} - ${moment(end).format(
                "HH:mm"
              )}`}
            </span>
          </div>
          <div className="content">
            <div>
              <input
                type="text"
                name="name1"
                placeholder="Возвещатель 1"
                value={state.name1}
                required
                minLength={3}
                onChange={handleStateChange}
              />
              <input
                type="text"
                name="name2"
                required
                minLength={3}
                placeholder="Возвещатель 2"
                value={state.name2}
                onChange={handleStateChange}
              />
            </div>
            <Notification message={message} />
          </div>

          <div className="actions">
            <div>
              <button
                className="button success hover:bg-green-600 transition ease-in-out duration-250"
                onClick={saveHandler}
                disabled={
                  !state.name1 || !state.name2 || !state.title || !stateChanged
                }
              >
                {id ? "Изменить" : "Сохранить"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "4px" }}>
              {id && (
                <ConfirmPopup
                  handleConfirm={() => handleDelete(id)}
                  text="Вы уверены, что хотели бы удалить?"
                  top="-top-[85px]"
                  btnClass="danger hover:bg-red-700"
                  nested={true}
                  button={
                    <button className="button danger hover:bg-red-700 transition ease-in-out duration-250">
                      Удалить
                    </button>
                  }
                />
              )}
              <button
                className="button hover:text-[#6992ca] hover:border-[#6992ca] transition ease-in-out duration-250"
                onClick={closeModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </PopupWrapper>
    </div>
  );
};

export default ControlledPopup;
