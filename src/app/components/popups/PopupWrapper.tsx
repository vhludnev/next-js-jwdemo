import "reactjs-popup/dist/index.css";
import Popup from "reactjs-popup";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
  //[x: string]: any;
} & ComponentProps<typeof Popup>;

export default function PopupWrapper({ children, ...otherProps }: Props) {
  return <Popup {...otherProps}>{children}</Popup>;
}
