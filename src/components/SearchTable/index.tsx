import { useState, useEffect, useCallback, JSX, CSSProperties } from "react";
import { useProgress } from "@/components/Progress";
import { SessionData } from "@/libs/session";
import { debounce } from "@/libs/functions";
import { apiFetch } from "@/libs/apiClient";
import Button from "@/components/Button";
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
  style: CSSProperties | undefined;
  session: SessionData;
};

export default function SearchTable({ columns, endpoint, method = "GET", resultVariable, primaryField = "id", isSearchable = true, isSelectable = false, orderBy = "", recordsPerPage = 10, actions, style, session }: SearchTableProps) {
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get element
    const { name, value, type } = e.target;

    // set data
    // setFieldsValue((prevState: any) => ({
    //   ...prevState,
    //   [name]: value
    // }));

    // // if not text element
    // if (type !== "text") {
    //   // set data
    //   setSearchQuery((prevState: any) => ({
    //     ...prevState,
    //     [name]: value
    //   }));
    // }
  }

  useEffect(() => {
    setAllSelected(selected.length > 0 ? true : false)
  }, [selected]);

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  return (
    <>
      <div className="data-table" style={style}>
        <div>
          <div className="flex items-center justify-between p-3 border-b border-black/10 dark:border-white/10">
            <div className="flex flex-col">
              <h1>View Records</h1>
              <span className="text-xs text-gray-500">Keep track of logs and activities</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Button color="success" size="md" className="text-white">
                  <Icon name="Plus" size={16}  />
                  <span>Add New</span>
                </Button>
              </div>


              {/* <button className={twMerge("btn-action group")} key={index} title={action.label} onClick={(e) => action.onClick(e, selected)} disabled={selected.length > 0 ? false : true}>{action.icon} Delete</button> */}

              {/* <Button color="secondary" size="sm" className="btn border dark:border-white/10 !px-2">
                <Icon name="Plus" size={16} className="text-green-500 hover:text-green-600" />
                <span>Create New</span>
              </Button>

              <Button color="secondary" size="sm" className="btn border dark:border-white/10 !px-2">
                <Icon name="Trash" size={16} className="text-red-500 hover:text-red-600" />
                <span>Trash</span>
              </Button> */}
            </div>
          </div>
          <div className="flex items-center justify-between py-2 px-3 border-b border-black/10 dark:border-white/10">
            <Textbox type="search" esize="sm" rounded="sm" placeholder="Search Data" onChange={onSearch} className="!w-auto" />
            <div className="flex items-center">
              {isSelectable && actions && (
                <div className="flex items-center gap-2">
                  {actions.filter((action) => typeof action.multiple == "undefined" || action.multiple == true).map((action, index) =>
                    // <Button key={index} color="secondary" size="sm" className="btn border dark:border-white/10" disabled={selected.length > 0 ? false : true}>
                    //   {action.icon}
                    //   <span>{action.label}</span>
                    // </Button>

                    <button key={index} className="p-[9px] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button">
                      {action.icon}
                    </button>
                  )}
                </div>
              )}

              {/* <button className={twMerge("btn-action group")} key={index} title={action.label} onClick={(e) => action.onClick(e, selected)} disabled={selected.length > 0 ? false : true}>{action.icon} Delete</button> */}

              {/* <Button color="secondary" size="sm" className="btn border dark:border-white/10 !px-2">
                <Icon name="Plus" size={16} className="text-green-500 hover:text-green-600" />
                <span>Create New</span>
              </Button>

              <Button color="secondary" size="sm" className="btn border dark:border-white/10 !px-2">
                <Icon name="Trash" size={16} className="text-red-500 hover:text-red-600" />
                <span>Trash</span>
              </Button> */}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                {isSelectable && (
                  <th className="w-[20px]">
                    <CheckRadio type="checkbox" id="select-all" onChange={onSelect} checked={allSelected} />
                  </th>
                )}
                {columns.map((column, index) =>
                  <th key={index} style={{ width: column.width ?? "auto" }}>
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
                <th className="w-[100px] !text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.map((row: any, index: number) =>
                <tr key={index}>
                  {isSelectable && (
                    <td>
                      <CheckRadio type="checkbox" id={"row-" + index} value={row[primaryField]} checked={selected.includes(row[primaryField])} onChange={onSelect} />
                    </td>
                  )}
                  {columns.map((column, index) =>
                    <td key={index}>
                      {typeof column.render === "function" ? column.render(row[column.field], row) : row[column.field]}
                    </td>
                  )}
                  {actions && (
                    <td>
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
        </div>
        <div className="table-navigation">
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
    </>
  );
}
