import { useState, useEffect, useCallback, JSX } from "react";
import { useProgress } from "@/components/Progress";
import { SessionData } from "@/libs/session";
import { debounce } from "@/libs/functions";
import { apiFetch } from "@/libs/apiClient";
import Textbox from "@/components/Textbox";
import DropDown, { OptionType } from "@/components/Dropdown";
import CheckRadio from "@/components/CheckRadio";
import { Icon } from "@/components/Icon";
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
  multiple?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, selected: any) => void;
}

// define prop type
type SearchTableProps = {
  columns: ColumnType[];
  endpoint: string;
  method?: string;
  resultVariable?: string;
  primaryField?: string;
  isSearchable?: boolean | undefined;
  isSelectable?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;
  actions?: ActionType[] | undefined;
  session: SessionData;
};

export default function SearchTable({ columns, endpoint, method = "GET", resultVariable, primaryField = "id", isSearchable = true, isSelectable = false, orderBy = "", recordsPerPage = 10, actions, session }: SearchTableProps) {
  const { showProgress } = useProgress();
  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<any>({});
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [data, setData] = useState<unknown[]>([]);

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

      // call api response
      const response = await apiFetch(session, url.toString(), {
        method: method,
        cache: "no-store"
      });

      // set data
      setData(resultVariable ? response[resultVariable] : response);

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

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get element
    const { checked, id, value } = e.target;

    // if select all
    if (id == "select-all") {
      // if selecteds
      if (checked) {
        // select all rows        
        setSelected(data.map((row: any) => row[primaryField]));
      } else {
        // unselect all rows
        setSelected([]);
      }
    } else {
      // if selected
      if (checked) {
        // add selected row to list
        setSelected([...selected, value]);
      } else {
        // remove selected row from list
        setSelected((prevKeys) => prevKeys.filter(key => key !== value));
      }
    }
  }

  useEffect(() => {
    setAllSelected(selected.length > 0 ? true : false)
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-md overflow-hidden">
        <div className={twMerge("data-table")}>
          <table>
            <thead>
              <tr>
                {isSelectable && (
                  <th className="w-[20px] px-4 py-2.5">
                    <CheckRadio type="checkbox" id="select-all" onChange={onSelect} checked={allSelected} />
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

                <th className="w-[100px] p-2.5">
                  {isSelectable && actions ?
                    <div className="flex items-center justify-center gap-3">
                      {actions.filter((action) => typeof action.multiple == "undefined" || action.multiple == true).map((action, index) =>
                        <button className={twMerge("btn-action group")} key={index} title={action.label} onClick={(e) => action.onClick(e, selected)} disabled={selected.length > 0 ? false : true}>{action.icon}</button>
                      )}
                    </div>
                    : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.map((row: any, index: number) =>
                <tr key={index} className="border-t border-black/10 dark:border-white/10">
                  {isSelectable && (
                    <td className="text-left px-4 py-2.5">
                      <CheckRadio type="checkbox" id={"row-" + index} value={row[primaryField]} checked={selected.includes(row[primaryField])} onChange={onSelect} />
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
                          <button className={twMerge("btn-action group")} key={index} title={action.label} onClick={(e) => action.onClick(e, [row[primaryField]])} disabled={selected.includes(row[primaryField])}>{action.icon}</button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
          <div className="table-naigation bg-gray-100 dark:bg-gray-800 border-t border-black/10 dark:border-white/10 flex gap-2 flex-row justify-center p-2.5">
            <button className="btn-nav">
              <Icon name="ChevronsLeft" size={16} />
            </button>
            <button className="btn-nav">
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button className="btn-nav text-xs">
              1
            </button>
            <button className="btn-nav">
              <Icon name="ChevronRight" size={16} />
            </button>
            <button className="btn-nav">
              <Icon name="ChevronsRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
