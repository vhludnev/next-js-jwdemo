import moment from "moment";
import { AREA } from "@/constants";
import "moment/locale/ru";
import "moment/locale/lv";
import { TAccess, TUser } from "@/types/user";
import { TEvent } from "@/types/event";
import type { TRoundedSize } from "@/types/modal";
moment.locale("ru");

export const backgroundColor = (title: string) => {
  const area = AREA.find((a) => a.title === title);
  if (area) {
    return area.color;
  }
  return "#8B80F9";
};

export const transformedData = (el: any) => {
  return {
    ...el,
    start: new Date(Date.parse(el.start)),
    end: new Date(Date.parse(el.end)),
  };
};

export const transformedTime = (date: Date, newHour: number) => {
  const m = moment(date);
  // @ts-expect-error
  m.set({ h: newHour, m: "00" });
  return m.toDate();
};

export const capitalizeString = (string: string) => {
  return `${string.charAt(0).toUpperCase()}${string
    .slice(1)
    .toLocaleLowerCase()}`;
};

export const overlappingHours = (events: TEvent[], event: any) => {
  if (event.action !== "select") {
    return false;
  }
  const sameLocationEvents = events.filter(
    (el) =>
      el.resourceId === event.resourceId &&
      moment(el.start).format("YYYY-MM-DD") ===
        moment(event.slots[0]).format("YYYY-MM-DD")
  );

  function getRange(
    startDate: TEvent["start"],
    endDate: TEvent["end"],
    type = "minutes" as any
  ) {
    let fromDate = moment(startDate);
    let toDate = moment(endDate);

    let diff = toDate.diff(fromDate, type);
    let range = [];
    for (let i = 0; i < diff; i++) {
      range.push(moment(startDate).add(i, type).format());
    }
    return range;
  }

  return sameLocationEvents.some((el) =>
    getRange(el.start, el.end).some((el) =>
      getRange(event.slots[0], event.slots[event.slots.length - 1]).includes(el)
    )
  );
};

export const resourceMap = AREA.map((a) => {
  return {
    resourceId: a.id,
    resourceTitle: a.title,
    resourceShortTitle: a.shortTitle,
  };
});

export const permissionClient = (access: TAccess, user: TUser) => {
  if (!user) return false;
  switch (access) {
    case "publisher":
      return user.verified && !!user.name;
    case "admin":
      return ["admin"].includes(user.status);
    default:
      return false;
  }
};

/* Validation: allowed two words in Russian or Latvian */
export const nameIsValid = (name: string) =>
  /^[a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ]+ ([\-a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ.]+)$|^[а-яА-ЯЁё]+ ([-а-яА-ЯЁё.]+)$/.test(
    name.trim()
  );

export const nameIsValidList = (name: string) =>
  /^[a-vA-VzZāĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ.\s]*$|^[а-яА-ЯЁё.\s]*$/.test(name);

export const emailIsValid = (email: string) =>
  /^(\w[-._+\w]*\w@\w[-._\w]*\w\.\w{2,3})$/.test(email);

export const userMessage = (
  title: string,
  response: "success" | "error",
  value?: "google" | "credentials"
) => {
  switch (title) {
    case "name":
      return response === "success"
        ? "Имя возвещателя обнавлено успешно!"
        : response;
    case "email":
      return response === "success"
        ? "Адрес эл. почты возвещателя обнавлен успешно!"
        : response;
    case "provider":
      return response === "success"
        ? `${
            value === "google"
              ? "Авторизация через Гугл кнопку была активированна!"
              : "Авторизация через Гугл кнопку отключена!"
          }`
        : response;
    case "verified":
      return response === "success"
        ? "Возвещатель подтверждён успешно!"
        : response;
    case "status":
      return response === "success" ? "Доступ изменён успешно!" : response;
    default:
      return "";
  }
};

export const cc = (...classes: unknown[]) => {
  return classes.filter((c) => typeof c === "string").join(" ");
};

export const rounded = (
  loc: "all" | "t" | "b" = "all",
  size: TRoundedSize = "default"
) => {
  const r = "rounded";

  if (loc == "all") {
    if (size == "default") {
      return "rounded";
    } else {
      return `${r}-${size}`;
    }
  } else {
    if (size == "default") {
      return `${r}-${loc}`;
    }
    return `${r}-${loc}-${size}`;
  }
};
