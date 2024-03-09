import { useState } from "react";
import { cc, overlappingHours, resourceMap, rounded } from "@/utils";
import { AREA } from "@/constants";
import Notification from "../Notification";
import { usePrevious } from "@/hooks/usePrevious";
import type { EventPopupProps, TEvent, TEventDate } from "@/types/event";
import Modal, { ModalPassedProps } from "./Modal";

type Props = Omit<EventPopupProps, "handleDelete"> & {
  updateMessage: (status: string, text: string) => void;
  events: TEvent[];
};

const ControlledPopupEditable = ({
  data,
  open,
  closeModal,
  moment,
  updateMessage,
  handleSave,
  message,
  events,
  lockScroll,
  closeOnDocumentClick,
  className,
  roundedSize,
}: Props & ModalPassedProps) => {
  const { date } = data as TEventDate;

  const initialState = {
    title: "",
    date: date ? moment(date).format("YYYY-MM-DD") : "",
    timeFrom: "06:00",
    timeTo: "07:00",
    name1: "",
    name2: "",
  };

  const [state, setState] = useState(initialState);

  const stateChanged = usePrevious(state);

  const start = moment(
    state.date + " " + state.timeFrom,
    "YYYY-MM-DD HH:mm"
  ).toDate();
  const end = moment(
    state.date + " " + state.timeTo,
    "YYYY-MM-DD HH:mm"
  ).toDate();

  const resourceId = state.title
    ? resourceMap.filter((r) => r.resourceTitle === state.title)[0]?.resourceId
    : undefined;

  const dataToSave: TEvent = {
    ...state,
    start,
    end,
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
    const startTime = +moment(state.timeFrom, "HH:mm").format("HH");
    const endTime = +moment(state.timeTo, "HH:mm").format("HH");
    const today = moment().format("YYYY-MM-DD");
    const now = moment().toDate();

    if (state.date < today) {
      return updateMessage("error", "Проверьте дату");
    }

    if (!state.name1 || !state.name2 || !state.title) {
      return updateMessage("error", "Проверьте данные");
    }

    if (
      start < now ||
      state.timeFrom >= state.timeTo ||
      startTime < 6 ||
      endTime < 6 ||
      startTime > 19 ||
      endTime > 20
    ) {
      return updateMessage("error", "Проверьте время");
    }

    /* no overlaping existing stands */
    const eventObj = {
      action: "select",
      resourceId,
      slots: [start, end],
    };
    if (overlappingHours(events, eventObj)) {
      return updateMessage("error", "Это время уже занято");
    }

    return await handleSave(dataToSave);
  };

  const handleCloseModal = () => {
    setState(initialState);
    closeModal();
    return;
  };

  return (
    <div>
      <Modal
        isOpen={open}
        onClose={handleCloseModal}
        closeOnDocumentClick={closeOnDocumentClick}
        className={className}
        lockScroll={lockScroll}
        roundedSize={roundedSize}
      >
        <div className={cc("header", rounded("t", roundedSize))}>
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

          <span className="flex self-center items-center">
            <input
              className="text-center w-full min-w-[128px] mx-1 my-0 font-normal px-1.5 rounded-lg focus:ring-1 focus:ring-inset focus:ring-[rgb(88,164,176)] focus:ring-opacity-50"
              type="date"
              name="date"
              min={moment().format("YYYY-MM-DD")}
              value={state.date}
              onChange={handleStateChange}
            />
            &#128337;
            <input
              className="text-center w-full min-w-[55px] mx-1 my-0 max-w-[102px] font-normal px-1.5 rounded-lg focus:ring-1 focus:ring-inset focus:ring-[rgb(88,164,176)] focus:ring-opacity-50"
              type="time"
              name="timeFrom"
              min="06:00"
              max="19:30"
              step={1800}
              value={state.timeFrom}
              onChange={handleStateChange}
            />
            <b>-</b>
            <input
              className="text-center w-full min-w-[55px] mx-1 my-0 max-w-[102px] font-normal px-1.5 rounded-lg focus:ring-1 focus:ring-inset focus:ring-[rgb(88,164,176)] focus:ring-opacity-50"
              type="time"
              name="timeTo"
              min="06:30"
              max="20:00"
              step={1800}
              value={state.timeTo}
              onChange={handleStateChange}
            />
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

        <div className={cc("actions", rounded("b", roundedSize))}>
          <div>
            <button
              className="button success hover:bg-green-600 transition ease-in-out duration-250"
              onClick={saveHandler}
              disabled={
                !state.name1 || !state.name2 || !state.title || !stateChanged
              }
            >
              Сохранить
            </button>
          </div>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              className="button hover:text-[#6992ca] hover:border-[#6992ca] transition ease-in-out duration-250"
              onClick={handleCloseModal}
            >
              Закрыть
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ControlledPopupEditable;
