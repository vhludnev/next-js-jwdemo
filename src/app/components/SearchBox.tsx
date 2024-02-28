import { forwardRef, ReactNode, FormEvent } from "react";
import SearchIcon from "./SearchIcon";

interface Props {
  children?: ReactNode;
  onChange: (e: { target: HTMLInputElement }) => void;
  onSubmit: (e: FormEvent) => void;
  criteria: string;
  placeholder?: string;
}

export type Ref = HTMLInputElement;

const SearchBox = forwardRef<Ref, Props>(
  ({ onChange, criteria, placeholder = "Поиск", onSubmit = () => {} }, ref) => {
    const onFocusStyles =
      "focus:bg-white focus:text-gray-500 focus:cursor-text focus:pr-4 focus:flex-1 focus:pl-11 md:focus:pl-12 focus:caret-gray-300 focus:w-56 sm:focus:w-64 focus:placeholder:duration-500 focus:placeholder:text-blue-300";
    const onCriteria =
      "bg-white text-gray-500 cursor-text pr-4 flex-1 pl-11 md:pl-12 caret-gray-300 w-56 sm:w-64 shadow shadow-formBox";

    return (
      <form
        className="relative dark:filter dark:brightness-90"
        onSubmit={onSubmit}
      >
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          onChange={onChange}
          value={criteria}
          autoComplete="off"
          className={`bg-transparent peer cursor-pointer border-0 relative z-10 h-10 md:h-12 w-12 rounded-full outline-none transition-all duration-500 transform ${onFocusStyles} ${
            criteria
              ? onCriteria
              : "text-transparent caret-transparent placeholder:text-transparent"
          }`}
        />
        <SearchIcon
          className={`absolute inset-y-0 my-auto h-8 w-12 px-3.5 peer-focus:z-10 peer-focus:stroke-blue-300 ${
            criteria ? "z-10 stroke-blue-300" : "stroke-gray-500"
          }`}
        />
      </form>
    );
  }
);

export default SearchBox;
