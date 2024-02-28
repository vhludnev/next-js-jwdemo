import moment from "moment";

export type TEvent = {
  id?: string;
  title: string;
  name1?: string;
  name2?: string;
  start: Date;
  end: Date;
  resourceId?: number | string;
};

export type TEventNew = Omit<TEvent, "id">;

export type TEventDate = { date: Date | string };

export type EventPopupProps = {
  open: boolean;
  data: TEvent | TEventDate | null;
  closeModal: () => void;
  moment: typeof moment;
  handleSave: (values: TEvent) => void;
  handleDelete: (id: TEvent["id"]) => void;
  message?: { status: string; text: string };
};
