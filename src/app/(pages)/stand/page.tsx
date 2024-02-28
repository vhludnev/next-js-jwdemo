"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import dynamic from "next/dynamic";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Calendar,
  momentLocalizer,
  Navigate,
  View,
  SlotInfo,
} from "react-big-calendar";
import {
  BsCalendarPlus,
  BsPerson,
  BsTrash,
  BsCalendarDay,
  BsCalendar3,
  BsCalendar3Event,
  BsCalendar3Week,
  BiSolidChevronLeft,
  BiSolidChevronRight,
} from "@/lib/icons";

import {
  backgroundColor,
  overlappingHours,
  transformedData,
  resourceMap,
  permissionClient,
} from "@/utils";
import Spinner from "@/components/Spinner";
import { TEvent, TEventDate } from "@/types/event";
import "moment/locale/ru";

moment.locale("ru");

const ConfirmPopup = dynamic(() => import("@/components/popups/ConfirmPopup"));
const ControlledPopup = dynamic(
  () => import("@/components/popups/ControlledPopup")
);
const ControlledPopupEditable = dynamic(
  () => import("@/components/popups/ControlledPopupEditable")
);

const localizer = momentLocalizer(moment);

export default function BigCalendar() {
  const [open, setOpen] = useState(false);
  const [openEditable, setOpenEditable] = useState(false);
  const [data, setData] = useState<TEvent | TEventDate | null>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [message, setMessage] = useState<
    | {
        status: string;
        text: string;
      }
    | undefined
  >(undefined);

  const closeModal = () => {
    open ? setOpen(false) : setOpenEditable(false);
    setData(null);
    setMessage(undefined);
    document.body.style.overflow = "unset";
    return;
  };
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(`/api`);
      const { data }: { data: TEvent[] } = await response.json();
      setEvents(data.map((el) => transformedData(el)));
      setLoading(false);
    })();
  }, []);

  const updateMessage = (status: string, text: string) => {
    setMessage({ status, text });
  };

  const handleSave = async (values: TEvent) => {
    const { id, ...rest } = values;

    if (id) {
      const response = await fetch(`/api/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });

      const { error } = await response.json();

      if (error) {
        updateMessage("error", error);
        setTimeout(() => setMessage(undefined), 5000);
        return;
      }

      setEvents(events.map((event) => (event.id === id ? values : event)));
    } else {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
      });

      const { data, error } = await response.json();

      if (error) {
        updateMessage("error", error);
        setTimeout(() => setMessage(undefined), 5000);
        return;
      }

      setEvents([
        ...events,
        {
          ...transformedData(data),
        },
      ]);
    }
    closeModal();
  };

  const handleDelete = async (id: TEvent["id"]) => {
    const { error }: any = await fetch(`/api/${id}`, {
      method: "DELETE",
    });

    if (error) {
      updateMessage("error", error.response.data.error);
      setTimeout(() => setMessage(undefined), 5000);
      return;
    }

    setEvents(events.filter((event) => event.id !== id));
    closeModal();
  };

  //   type Props = (event: TEvent & Partial<SlotInfo>) => void;

  //   const handleSelect = useCallback<Props>(
  //     (event: TEvent & Partial<SlotInfo>) => {
  const handleSelectEvent = useCallback(
    (event: TEvent) => {
      setData({
        ...event,
        title: event.title
          ? event.title
          : resourceMap.filter((r) => r.resourceId === event.resourceId)[0]
              .resourceTitle,
      });

      setOpen(true);
      return;
    },
    [events]
  );

  const handleSelectSlot = useCallback(
    (slotEvent: SlotInfo) => {
      /* no clicking to choose a new stand */
      if (slotEvent.slots && slotEvent.slots.length < 3) {
        return;
      }
      /* no selecting in past due dates/time, only clicking existing allowed */
      if (
        slotEvent.action === "select" &&
        new Date(slotEvent.start) < new Date()
      ) {
        return;
      }
      /* no overlaping existing stands */
      if (overlappingHours(events, slotEvent)) {
        return;
      }

      setData({
        start: slotEvent.start,
        end: slotEvent.end,
        resourceId: slotEvent?.resourceId,
        title: "",
      });

      setOpen(true);
      return;
    },
    [events]
  );

  const pastEvents = useMemo(
    () => events.filter((event) => new Date(event.end) < new Date()),
    [events]
  );

  const handleDeleteMany = async (): Promise<any> => {
    const { error }: any = await fetch("/api", {
      method: "DELETE",
    });

    if (error) {
      return;
    }

    return setEvents(
      events.filter((event) => new Date(event.end) >= new Date())
    );
  };

  const RBCToolbar = (props: any) => {
    const changeView = (name: string) => {
      switch (name) {
        case "month":
          props.onView("month");
          break;
        case "week":
          props.onView("week");
          break;
        case "day":
          props.onView("day");
          break;
        default:
          props.onView("month");
          break;
      }
    };

    const goToToday = () => props.onNavigate(Navigate.TODAY);

    const goToBack = () => props.onNavigate(Navigate.PREVIOUS);

    const goToNext = () => props.onNavigate(Navigate.NEXT);

    const today =
      moment(props.date).format("DD-MM-YYYY") === moment().format("DD-MM-YYYY");
    return (
      <>
        <div className="flex items-center md:gap-5 h-12 min-h-[3rem] mb-2 md:mb-3 relative sm:justify-end">
          <div className="flex flex-grow items-center">
            <div className="font-sans inline-flex items-center text-base sm:text-xl md:text-2xl font-bold rounded gap-1 md:gap-6 text-[#6992ca] dark:text-primary-white sm:absolute sm:left-1/2 sm:justify-center sm:-translate-x-1/2">
              <span
                className="cursor-pointer"
                id="prev-btn-icon"
                onClick={goToBack}
              >
                <BiSolidChevronLeft size={24} />
              </span>
              <span className="uppercase text-center">{props.label}</span>
              <span
                className="cursor-pointer"
                id="next-btn-icon"
                onClick={goToNext}
              >
                <BiSolidChevronRight size={24} />
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-3 md:gap-5">
            <BsCalendarPlus
              name="addnew"
              cursor="pointer"
              className="text-green-600 text-xl md:text-2xl xl:text-3xl"
              onClick={() => {
                setData({ date: props.date }), setOpenEditable(true);
              }}
            />

            <BsCalendarDay
              name="today"
              cursor="pointer"
              className="text-xl md:text-2xl xl:text-3xl"
              color={today ? "dodgerblue" : "#93c5fd"}
              onClick={goToToday}
            />

            <BsCalendar3
              name="month"
              cursor="pointer"
              className="text-xl md:text-2xl xl:text-3xl"
              color={props.view === "month" ? "dodgerblue" : "#93c5fd"}
              onClick={() => changeView("month")}
            />

            <BsCalendar3Week
              name="week"
              cursor="pointer"
              className="text-xl md:text-2xl xl:text-3xl"
              color={props.view === "week" ? "dodgerblue" : "#93c5fd"}
              onClick={() => changeView("week")}
            />

            <BsCalendar3Event
              name="day"
              cursor="pointer"
              className="text-xl md:text-2xl xl:text-3xl"
              color={props.view === "day" ? "dodgerblue" : "#93c5fd"}
              onClick={() => changeView("day")}
            />
          </div>
          {/* <Button onClick={() => props.onView("agenda")}>Month</Button>
          <Button onClick={() => props.onView("agenda")}>Bar</Button> */}
        </div>
      </>
    );
  };

  const { components, defaultDate, views, formats } = useMemo(
    () => ({
      defaultDate: new Date(),
      views: ["month", "week", "day"] as View[],
      components: {
        event: (props: { event: TEvent }) => {
          const { title, name1, name2, start, end } = props.event;
          return (
            <>
              <div>{title}</div>
              <div>
                <div>
                  <span role="img" aria-label="Bust in Silhouette">
                    <BsPerson color="white" />
                  </span>{" "}
                  <span>{name1}</span>
                </div>

                <div>
                  <span role="img" aria-label="Bust in Silhouette">
                    <BsPerson color="white" />
                  </span>{" "}
                  <span>{name2}</span>
                </div>
              </div>
              <div>{`${moment(start).format(" HH:mm")} - ${moment(end).format(
                "HH:mm"
              )}`}</div>
            </>
          );
        },
        toolbar: RBCToolbar,
      },
      formats: {
        // weekdayFormat: (date, culture, localizer) =>
        // localizer.format(date, "dddd", culture),
        dayHeaderFormat: (date: Date) => moment(date).format("dddd D MMM"),
        // eventTimeRangeFormat: () => "Расположение",
        dayRangeHeaderFormat: ({
          start,
          end,
        }: {
          start: TEvent["start"];
          end: TEvent["end"];
        }) => `${moment(start).format("D")} - ${moment(end).format("D MMMM")}`,
      },
    }),
    []
  );

  if (!session) return null;

  return (
    <>
      <h1 className="head_text blue_gradient text-center mt-0 md:mt-2">
        Служение со стендами
      </h1>
      {permissionClient("admin", session?.user) && !!pastEvents.length && (
        <ConfirmPopup
          handleConfirm={handleDeleteMany}
          text="Вы уверены, что хотели бы удалить все прошедшие стенды?"
          top="-top-[100px]"
          btnClass="danger hover:bg-red-700"
          lockScroll
          button={
            <button className="absolute right-1 top-1 sm:top-0 z-10">
              <BsTrash
                size={20}
                className="hover:text-red-700"
                color="#d97706"
              />
            </button>
          }
        />
      )}
      {open && (
        <ControlledPopup
          open={open}
          closeModal={closeModal}
          data={data}
          moment={moment}
          handleSave={handleSave}
          handleDelete={handleDelete}
          message={message}
        />
      )}

      {openEditable && (
        <ControlledPopupEditable
          open={openEditable}
          closeModal={closeModal}
          data={data}
          moment={moment}
          handleSave={handleSave}
          message={message}
          events={events}
          updateMessage={updateMessage}
        />
      )}

      <div className="mt-3 sm:mt-5 lg:mt-10">
        {loading && <Spinner />}
        <Calendar
          localizer={localizer}
          events={events}
          //allDayAccessor="allDay"
          //startAccessor="start"
          //endAccessor="end"
          resourceIdAccessor="resourceId"
          resources={resourceMap}
          //resourceTitleAccessor='resourceTitle'
          resourceTitleAccessor="resourceShortTitle"
          defaultDate={defaultDate}
          defaultView="month"
          popup={false}
          //step={15}
          //popupOffset={{ x: 0, y: -150 }}
          //popupOffset={{ x: 0, y: 0 }}
          formats={formats}
          dayLayoutAlgorithm="no-overlap"
          //min={moment(`${new Date().toISOString().slice(0, 10)} 6:00`).toDate()}
          //max={moment(`${new Date().toISOString().slice(0, 10)} 19:00`).toDate()}
          min={moment("2020-01-01T05:00:00").toDate()}
          max={moment("2030-01-01T20:00:00").toDate()}
          //style={{ height: /* '100vh' */ '600px' }}
          //className='h-[calc(100vh-115px)] md:h-[calc(100vh-150px)]'
          className="h-[calc(100dvh-140px)] xs:h-[calc(100dvh-120px)] md:h-[calc(100dvh-200px)] landscape:min-h-[500px]"
          eventPropGetter={(event) => {
            return {
              style: {
                backgroundColor: backgroundColor(event.title) /* : "#3f51b5" */,
                borderRadius: "8px",
                border: `1px solid ${backgroundColor(event.title)}`,
              },
            };
          }}
          //   formats={{
          //     dayHeaderFormat: (date) => moment(date).format("dddd - D MMM"),
          //   }}
          selectable
          views={views}
          messages={{
            allDay: "Весь День",
            // next: (
            //   <span>
            //     Вперёд <ImArrowRight2 />
            //   </span>
            // ),
            // previous: (
            //   <span>
            //     <ImArrowLeft2 /> Назад
            //   </span>
            // ),
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            agenda: "Список",
            date: "Дата",
            time: "Время",
            event: "События",
            noEventsInRange: "Список стендов пуст",
            showMore: (total) =>
              `+ ${total} ${total > 5 ? "стендов" : "стенда"}`,
          }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          components={components}
        />
      </div>
    </>
  );
}
