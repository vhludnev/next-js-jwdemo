"use client";

import dynamic from "next/dynamic";
import moment from "moment";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BiLockAlt, BiLockOpenAlt } from "@/lib/icons";
import Spinner from "@/components/Spinner";
import useDebounce from "@/hooks/useDebounce";
import "moment/locale/ru";
import SearchBox from "@/components/SearchBox";
import { userMessage } from "@/utils";
import { TUser } from "@/types/user";
moment.locale("ru");

const UserMainPopup = dynamic(
  () => import("@/components/popups/UserMainPopup")
);
const BackToTopButton = dynamic(() => import("@/components/BackToTopButton"));

type TAccessors = Pick<TUser, "email" | "name" | "status"> & {
  number: number | string;
};

type Props = {
  handleSorting: (
    sortField: keyof TAccessors,
    sortOrder: "asc" | "desc"
  ) => void;
};

const columns: {
  label: string;
  accessor: keyof TAccessors;
  sortable: boolean;
}[] = [
  { label: "#", accessor: "number", sortable: false },
  { label: "Имя", accessor: "name", sortable: true },
  { label: "Эл.почта", accessor: "email", sortable: true },
  { label: "Статус", accessor: "status", sortable: true },
];

const SearchComponent = ({
  updateSortedData,
  data,
}: {
  updateSortedData: (data: TUser[]) => void;
  data: TUser[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [criteria, setCriteria] = useState("");
  const debounedCriteria: string = useDebounce(criteria, 300);

  useEffect(() => {
    filterBySearch(debounedCriteria);
  }, [debounedCriteria]);

  const filterBySearch = useCallback(
    (query: string) => {
      // Access input value
      //const query = event.target.value

      // Create copy of item list
      let updatedList = [...data];
      // Include all elements which includes the search query
      // updatedList = updatedList.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      updatedList =
        debounedCriteria.length > 2
          ? updatedList.filter(({ name, email }) =>
              [name, email].some(
                (item) =>
                  item &&
                  item.toString().toLowerCase().includes(query.toLowerCase())
              )
            )
          : updatedList;
      // Trigger render with updated values
      updateSortedData(updatedList);
    },
    [debounedCriteria, data]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
  };

  return (
    <SearchBox
      ref={inputRef}
      onChange={(e: { target: HTMLInputElement }) =>
        setCriteria(e.target?.value)
      }
      criteria={criteria}
      onSubmit={onSubmit}
    />
  );
};

const TableHead = ({ handleSorting }: Props) => {
  const [sortField, setSortField] = useState<keyof TAccessors>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleSortingChange = (accessor: keyof TAccessors) => {
    const sortOrder =
      accessor === sortField && order === "asc" ? "desc" : "asc";
    setSortField(accessor);
    setOrder(sortOrder);
    handleSorting(accessor, sortOrder);
  };

  const handleClick = (sortable: boolean, accessor: keyof TAccessors) => {
    return sortable ? () => handleSortingChange(accessor) : null;
  };

  return (
    <thead className="text-teal border dark:filter dark:brightness-75 dark:border-gray-400">
      <tr className="bg-gray-200 table-row rounded-l-lg rounded-none mb-4 md:mb-0 text-left md:text-center dark:text-gray-900">
        {columns.map(({ label, accessor, sortable }) => {
          const cl = sortable
            ? sortField === accessor && order === "asc"
              ? "up"
              : sortField === accessor && order === "desc"
              ? "down"
              : "default"
            : "";

          const widerPaddings = ["status"].includes(accessor)
            ? "py-1 pl-3 pr-4 md:pr-3"
            : "p-3";
          const num = accessor === "number" ? "text-center" : "";
          return (
            <th
              className={`h-[50px] md:h-[42px] ${cl} ${widerPaddings} ${num}`}
              key={accessor}
              onClick={() => handleClick(sortable, accessor)}
            >
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

const TableBody = ({
  tableData = [],
  openModal,
}: {
  tableData: TUser[];
  openModal: (data: TUser) => void;
}) => {
  return (
    <tbody className="flex-none dark:filter dark:brightness-90">
      {tableData.map((data, idx) => {
        return (
          <tr
            className={`hover:bg-gray-50 bg-white table-row mb-4 md:mb-0 ${
              data.verified ? "dark:text-gray-600" : "text-gray-400"
            }`}
            key={data.username}
          >
            {columns.map(({ accessor }) => {
              let tData;
              switch (accessor) {
                case "number":
                  tData = idx + 1;
                  break;
                case "status":
                  tData =
                    data.status === "admin" ? (
                      <BiLockOpenAlt
                        cursor="pointer"
                        size={20}
                        className="mx-auto"
                        color="#07bc0c"
                        aria-describedby="popup-root"
                        onClick={() => openModal(data)}
                      />
                    ) : (
                      <BiLockAlt
                        cursor="pointer"
                        size={22}
                        className="mx-auto"
                        color={data.verified ? "#999" : "rgb(156 163 175)"}
                        aria-describedby="popup-root"
                        onClick={() => openModal(data)}
                      />
                    );
                  break;
                default:
                  tData = data[accessor];
                  break;
              }

              let specialStyle;
              switch (accessor) {
                case "number":
                  specialStyle = "text-center";
                  break;
                case "name":
                  specialStyle =
                    "long_text whitespace-normal max-w-[28vw] md:max-w-full";
                  break;
                case "email":
                  specialStyle = "long_text max-w-[34vw] md:max-w-full";
                  break;
                default:
                  specialStyle = "";
                  break;
              }

              return (
                <td
                  className={`px-3 py-1.5 h-[50px] md:h-[42px] border-grey-light border dark:border-gray-400 ${specialStyle}`}
                  key={accessor}
                >
                  {tData || ""}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

const Users = () => {
  const [data, setData] = useState<TUser[]>([]);
  const [tableData, setTableData] = useState<TUser[]>([]);
  const [popupData, setPopupData] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const openModal = (value: TUser) => setPopupData(value);
  const closeModal = () => {
    setPopupData(null);
    document.body.style.overflow = "unset";
    return;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(`/api/protected/users`);
      const { data } = await response.json();
      setTableData(data);
      setData(data);
      setLoading(false);
    })();
  }, []);

  const updateSortedData = useCallback(
    (value: TUser[]) => setTableData(value),
    []
  );

  const handleSorting = useCallback(
    (sortField: keyof TAccessors, sortOrder: "asc" | "desc") => {
      if (sortField) {
        const sorted = [...tableData].sort((a: any, b: any) => {
          if (a[sortField] === null) return 1;
          if (b[sortField] === null) return -1;
          if (a[sortField] === null && b[sortField] === null) return 0;
          return (
            a[sortField]
              .toString()
              .localeCompare(b[sortField].toString(), "ru", {
                sensitivity: "base",
              }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
        return setTableData(sorted);
      }
    },
    [tableData, setTableData]
  );

  const updateUserInfo = useCallback(
    async (
      id: TUser["id"],
      newInfoObj: Partial<TUser>
      //value: TUser["provider"] = "google"
    ) => {
      if (newInfoObj) {
        const response = await fetch(`/api/protected/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInfoObj),
        });

        const { error, data } = await response.json();

        const title = Object.keys(newInfoObj)[0];

        if (error) {
          toast.error(userMessage(title, error), { autoClose: 5000 });
          closeModal();
        }

        if (data) {
          toast.success(userMessage(title, "success", newInfoObj?.provider), {
            autoClose: 2000,
          });
          setTableData(tableData.map((user) => (user.id === id ? data : user)));
          closeModal();
        }
      }
    },
    [tableData, setTableData]
  );

  const removeUser = useCallback(
    async (id: TUser["id"]) => {
      const { error }: any = await fetch(`/api/protected/users/${id}`, {
        method: "DELETE",
      });

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Учётная запить успешно удалёна!", { autoClose: 2000 });
      setTableData(tableData.filter((user) => user.id !== id));
      setData(data.filter((user) => user.id !== id));
      closeModal();
    },
    [tableData, setTableData, data, setData]
  );

  //const countBy = (arr, prop) => arr.reduce((prev, curr) => ((prev[curr[prop]] = ++prev[curr[prop]] || 1), prev), {})

  if (data && !data.length) {
    return (
      <>
        <h1 className="head_text blue_gradient mt-0 md:mt-2 text-center">
          Список возвещателей
        </h1>
        {loading ? (
          <Spinner wrapper />
        ) : (
          <div className="text-center mt-10">Список пуст</div>
        )}
      </>
    );
  }

  return (
    <>
      <h1 className="head_text blue_gradient mt-0 md:mt-2 text-center">
        Список возвещателей
      </h1>

      <div className="flex items-center justify-evenly md:justify-between mt-6 md:mt-10 md:px-2 gap-4">
        <SearchComponent updateSortedData={updateSortedData} data={data} />
      </div>

      <table className="w-full rounded-lg overflow-hidden md:shadow-lg my-5 text-sm md:text-base md:mx-auto">
        <TableHead {...{ handleSorting }} />
        <TableBody {...{ tableData, openModal }} />
      </table>
      <BackToTopButton />
      {popupData && (
        <UserMainPopup
          popupData={popupData}
          closeModal={closeModal}
          updateUserInfo={updateUserInfo}
          removeUser={removeUser}
        />
      )}
    </>
  );
};

export default Users;
