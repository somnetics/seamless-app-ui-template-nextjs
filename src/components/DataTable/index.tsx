import { useState, useEffect, useCallback, JSX } from "react";
import { useProgress } from "@/components/Progress";
import { SessionData } from "@/libs/session";
import { debounce } from "@/libs/functions";
import { apiFetch } from "@/libs/apiClient";
import Textbox from "@/components/Textbox";
import DropDown, { OptionType } from "@/components/Dropdown";
import CheckRadio from "@/components/CheckRadio";
import { twMerge } from "tailwind-merge";

// define column type
type ColumnType = {
  field: string;
  label: string;
  alias?: string | undefined;
  type?: "text" | "select" | "date";
  options?: OptionType[];
  width?: number | string | undefined;
  defaultValue?: string | undefined;
  render?: (value: string, row: any) => JSX.Element;
}

// define action type
type ActionType = {
  label: string;
  icon: JSX.Element;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: any) => void;
}

// define prop type
type DataTableProps = {
  columns: ColumnType[];
  endpoint: string;
  method?: string;
  isSearchable?: boolean | undefined;
  isSelectable?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;
  actions?: ActionType[] | undefined;
  session: SessionData;
};

export default function DataTable({ columns, endpoint, method = "GET", isSearchable = true, isSelectable = false, orderBy = "", recordsPerPage = 10, actions, session }: DataTableProps) {
  const { showProgress } = useProgress();
  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<any>({});
  const [data, setData] = useState<any>([]);

  const fetchData = async () => {
    try {
      // activate page progress
      showProgress(true);

      // get url from endpoint
      const endpointUrl = new URL(`${window.origin}${endpoint}`);

      // extract endpoint
      const url = new URL(`${endpointUrl.origin}${endpointUrl.pathname}`);

      // loop params
      endpointUrl.searchParams.forEach((value: string, key: string) => {
        // add page params to search params
        url.searchParams.append(key, value.toString());
      });

      // add page value to search params
      // url.searchParams.append("page", currentPage.toString());

      // add page value to search params
      url.searchParams.append("size", recordsPerPage.toString());

      // add search fields
      columns.forEach((column) => {
        // get field value
        searchQuery[column.field] = typeof searchQuery[column.field] !== "undefined" ? searchQuery[column.field] : column.defaultValue || "";

        // check field name and value
        if (typeof column.field !== "undefined" && searchQuery[column.field].trim() !== "") {
          // get field alias
          const alias = column.alias;

          // add field key value to search params
          url.searchParams.append(`${column.alias ? `${alias}.${column.field}` : column.field}`, searchQuery[column.field].trim());

          // push field info
          // struct.push({
          //   name: `${alias != "" ? `${alias}.` : ""}${field.name}`,
          //   type: field.type
          // });
        }
      });

      // add table struct to search params
      // url.searchParams.append("struct", JSON.stringify(struct));

      // add page value to search params
      url.searchParams.append("order_by", orderBy);

      console.log(url.toString())

      // call api response
      const response = await apiFetch(session, url.toString(), {
        method: method
      });

      // set data
      setData(response);

      // pause
      setTimeout(() => {
        // activate page progress
        showProgress(false);
      }, 250);
    } catch (err: any) {
      // activate page progress
      showProgress(false);
    }
  }

  // manage multiple key strokes
  const setSearchParams = useCallback(debounce((name: string, value: string) => {
    // set data
    setSearchQuery((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  }, 500), []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    // get element
    const { name, value, type } = e.target;

    // set data
    setFieldsValue((prevState: any) => ({
      ...prevState,
      [name]: value
    }));

    // if not text element
    if (type !== "text") {
      // set data
      setSearchQuery((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // get element
    const { name, value } = e.currentTarget;

    if (e.key == "Enter") {
      // prevent from submit
      e.preventDefault();

      // fetch data
      fetchData();
    } else {
      // set search params 
      setSearchParams(name, value);
    }
  }

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  useEffect(() => {

  }, []);

  return (
    <>
      <div className="-bg-white -dark:bg-gray-800 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className={twMerge("data-table")}>
            <thead>
              <tr>
                {isSelectable && (
                  <th className="w-[20px] px-4 py-2.5">
                    <CheckRadio type="checkbox" id={"abc"} />
                  </th>
                )}
                {columns.map((column, index) =>
                  <th key={index} className="text-left p-2.5" style={{ width: column.width ?? "auto" }}>
                    {isSearchable ?
                      column.type == "text" || typeof column.type === "undefined" ?
                        <Textbox type="text" esize="sm" rounded="sm" name={column.field} placeholder={column.label} value={typeof fieldsValue[column.field] !== "undefined" ? fieldsValue[column.field] : column.defaultValue || ""} onChange={onChange} onKeyUp={onKeyUp} />
                        : column.type == "select" ?
                          <DropDown esize="sm" rounded="sm" name={column.field} options={[{ label: "", value: "" }, ...column.options || []]} value={typeof fieldsValue[column.field] !== "undefined" ? fieldsValue[column.field] : column.defaultValue || ""} onChange={onChange} />
                          : column.type == "date" && (
                            <Textbox type="date" esize="sm" rounded="sm" name={column.field} placeholder={column.label} value={typeof fieldsValue[column.field] !== "undefined" ? fieldsValue[column.field] : column.defaultValue || ""} onChange={onChange} onKeyUp={onKeyUp} />
                          )
                      : column.label
                    }
                  </th>
                )}
                {actions && (
                  <th className="w-[100px] p-2.5">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data && data.map((row: any, index: number) =>
                <tr key={index} className="border-t border-black/10 dark:border-white/10">
                  {isSelectable && (
                    <td className="text-left px-4 py-2.5">
                      <CheckRadio type="checkbox" id={"customCheckcolor1-" + index} />
                    </td>
                  )}
                  {columns.map((column, index) =>
                    <td key={index} className="text-left p-2.5">
                      {typeof column.render === "function" ? column.render(row[column.field], row) : row[column.field]}
                    </td>
                  )}
                  {actions && (
                    <td className="text-left p-2.5">
                      <div className="flex items-center justify-center gap-3">
                        {actions.map((action, index) =>
                          <button className="cursor-pointer" key={index} title={action.label} onClick={(e) => action.onClick(e, row)}>{action.icon}</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
