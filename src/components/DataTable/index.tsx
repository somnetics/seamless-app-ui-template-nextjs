import Link from "next/link";
import { Columns, Plus } from "lucide-react";
import { useState, useEffect, JSX, CSSProperties } from "react";
import { useContext } from "react";
import { randomId } from "@/libs/functions";
// import StoreContext from "@/context/StoreContext";
import DropDown, { OptionType } from "@/components/Dropdown";
import AutoComplete from "@/components/AutoSuggest/index_backup";
import { twMerge } from "tailwind-merge";
import { CircleMinus, SquareCheck, Trash2 } from "lucide-react";
import CheckRadio from "@/components/CheckRadio";
import Textbox from "@/components/Textbox";
import { SessionData } from "@/libs/session";
import { useProgress } from "@/components/Progress";

type ColumnType = {
  name?: string;
  value?: string;
  label: string;
  alias?: string | undefined;
  type?: "text" | "select" | "date" | "hidden";
  options?: OptionType[];
  width?: number | string | undefined;
  defaultValue?: string | undefined;
}

type DataTableProps = {
  name?: string;
  onAddFocusField?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  columns: ColumnType[];
  labelField?: string;
  valueField?: string;
  renderField?: (value: string) => JSX.Element;
  endpoint?: string;
  method?: string;
  resultVariable?: string;
  primaryField?: string;
  isSearchable?: boolean | undefined;
  isSelectable?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;
  style?: CSSProperties | undefined;
  session?: SessionData;
};

export default function DataTable({ method = "GET", primaryField = "id", isSearchable = true, isSelectable = true, recordsPerPage = 10, ...props }: DataTableProps) {
  const { showProgress } = useProgress();

  const [data, setData] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<any>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [columnHeader, setColumnHeader] = useState<ColumnType[]>([]);


  async function getItems(endpoint: string, method: string | undefined) {
    // activate form Progress
    showProgress(true);

    // return status from condition function
    try {
      // call api
      const response = await fetch(endpoint, { method: method ?? "GET" });

      // get response data
      let data: any = await response.json();

      // check for render field
      if (typeof props.renderField !== "undefined" && typeof props.renderField === "function") {
        // set search result
        setColumnHeader(data.map((item: any) => props.renderField!(item)));
      } else {
        // create funtion
        const fn = new Function("item", `return { label: item.${props.labelField}, value: item.${props.valueField} }`);

        // set search result
        setColumnHeader(data.map((item: any) => fn(item)));
      }
    } catch (err) {
      // show error
      console.log(err);
    }

    // on time out
    setTimeout(() => {
      // activate form Progress
      showProgress(false);
    }, 500);
  }

  // load data
  async function loadData(value: any = []) {
    // let rows
    let rows: any = [];

    // set id
    let _id: string = randomId();

    // check value type
    if (typeof value === "string") {
      // get values
      value = JSON.parse(value);

      // set rows
      rows = [...value];
    } else {
      // set rows
      rows = [...data, ...value];

      // get data
      const cols: any = { _id: _id };

      // loop columns
      props.columns.forEach((column: any) => {
        // set default column value
        cols[column.name] = typeof column.default !== "undefined" ? column.default : "";
      });

      // push row
      rows.push(cols);
    }

    // set data
    setData(rows);

    // on add focus field
    if (typeof props.onAddFocusField !== "undefined") {
      setTimeout(() => {
        // newly added row field
        const field = document.querySelector(`[data-rowid="${_id}"]#${props.onAddFocusField}`) as HTMLInputElement;

        // set focus on field
        if (field) field.focus();
      }, 100);
    }
  }

  //on select checkbox
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get element
    const { checked, id, value } = e.target;

    // if select all
    if (id == "select-all") {
      // if selected
      if (checked) {
        // select all rows        
        setSelected((data.slice(0, -1)).map((row: any) => row._id));
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

  // on add new
  async function onAdd(e: any) {
    e.preventDefault();

    // add data
    loadData([]);
  }

  // on remove
  function onRemove(e: any) {
    e.preventDefault();

    // storeContext.askConfirm({
    //   title: "Are you sure?",
    //   message: "Would you like to delete this item!",
    //   label: "Yes, delete it!",
    //   color: "danger",
    //   callback: (isConfirm: boolean) => {
    //     if (isConfirm) {
    //       // get data
    //       const rows: any = [...data];
    //       const index = rows.findIndex((r: any) => r._id == e.target.dataset.id);

    //       // if row exists
    //       if (index > -1) {
    //         // delete row
    //         rows.splice(index, 1);
    //       }

    //       // set data
    //       setData(rows);
    //     }
    //   }
    // })
  }

  // on focus
  function onEdit(e: any) {
    e.preventDefault();

    // // get data info
    const rowid = e.target.dataset.rowid;
    const id = e.target.id;

    // get column
    const column = props.columns.find((column: any) => column.name == id && typeof column.onEdit == "function");

    // if callback method defined
    if (typeof column !== "undefined") {
      // get data
      const rows: any = [...data];
      const index = rows.findIndex((r: any) => r._id == rowid);

      // // cal on focus callback
      // column.onEdit(rows[index], (row: any) => {
      //   // update data
      //   rows[index] = row;

      //   // set data
      //   setData(rows);
      // });
    }
  }

  // on focus
  function onFocus(e: any) {
    if (e.target.value.trim() == "") onEdit(e)
  }

  // on double click
  function onDoubleClick(e: any) {
    if (e.target.value.trim() != "") onEdit(e);
  }

  // on focus
  function onBlur(e: any) {
    e.preventDefault();

    // // get data info
    const rowid = e.target.dataset.rowid;
    const id = e.target.id;

    // get column
    const column = (props.columns).find((column: any) => column.name == id && typeof column.onBlur == "function");

    // if callback method defined
    if (typeof column !== "undefined") {
      // get data
      const rows: any = [...data];
      const index = rows.findIndex((r: any) => r._id == rowid);

      // // cal on focus callback
      // column.onBlur(rows[index], (row: any) => {
      //   // update data
      //   rows[index] = row;

      //   // set data
      //   setData(rows);
      // });
    }
  }

  // on change
  // function onChange(e: any) {
  //   e.preventDefault();

  //   // get data info
  //   const rowid = e.target.dataset.rowid;
  //   const id = e.target.id;

  //   console.log(e.target.dataset)

  //   // get value element
  //   const valueElement = document.querySelector(`.datatable textarea[name="${name}"]`) as HTMLTextAreaElement;

  //   // get data
  //   const rows: any = JSON.parse(valueElement.value);
  //   const index = rows.findIndex((r: any) => r._id == rowid);

  //   // if row exists
  //   if (index > -1) {
  //     // update value
  //     rows[index][id] = e.target.value;
  //   }

  //   // set data
  //   setData(rows);
  // }


  //on change
  function onChange(e: any) {
    e.preventDefault();

    //set row, column index and field name
    const rowIndex = Number(e.currentTarget.dataset.row)
    const colIndex = Number(e.currentTarget.dataset.col)
    const field = String(e.currentTarget.dataset.field)

    //set data
    setData((prevData: any[]) => {
      // update existing row
      const updatedIndex = [...prevData]
      updatedIndex[rowIndex] = {
        ...updatedIndex[rowIndex],
        [field]: e.target.value
      };
    setAllSelected(true)

      //add new row only if user types in last row
      if (rowIndex === prevData.length - 1 && updatedIndex[rowIndex].rows !== "") {
        //insert new empty row 
        loadData([]);
      }

      return updatedIndex;
    })
  }

  //delete a row
  function onDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    //index of row to delete
    const index = Number(e.currentTarget.dataset.index)

    //update the array after deletion
    setData((prev: any[]) => {
      const updated = [...prev];
      updated.splice(index, 1);

      return updated;
    });
  }

  const _onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
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

  useEffect(() => {
    console.log(selected.length, data.length)
    setAllSelected((selected.length == data.length - 1) ? true : false)
  }, [selected]);

  useEffect(() => {
    // empty data on load
    loadData(props.value);
  }, [props.value]);

  useEffect(() => {
    // get value element
    // const valueElement = document.querySelector(`.datatable textarea[name="${name}"]`) as HTMLTextAreaElement;

    console.log(data)
    // // set value to element
    // valueElement.value = JSON.stringify(data);
    // on loaded
    if (loaded) {
      // dispatch change event
      // valueElement.dispatchEvent(new Event('change'));
    } else {
      // set loaded
      if (data.length) setLoaded(true);
    }
  }, [data]);

  //set rows 
  useEffect(() => {
    console.log(props.columns)
  }, [props.columns])

  // useEffect(() => {
  //   // get value element
  //   const valueElement = document.querySelector(`.datatable textarea[name="${name}"]`) as HTMLTextAreaElement;

  //   // listen to on change events
  //   if (typeof onChange !== "undefined" && typeof onChange == "function") {
  //     // on change callback event
  //     valueElement.addEventListener('change', onChange);
  //   }
  // }, []);

  return (
    <div className="bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-md overflow-hidden">
      <div className={twMerge("datatable data-table")}>
        <table>
          <thead>
            <tr className="border-b border-gray-700 text-sm font-medium">
              <th className="w-[40px]">
                {data.length > 1 && isSelectable && (
                  <CheckRadio type="checkbox" id="select-all" onChange={onSelect} checked={allSelected} />
                )}
              </th>
              {props.columns.map((row: any, index: number) => (
                (row.type != "hidden"
                  ? <th className="w-auto" key={index}>{row.label}</th>
                  : ""
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, rowIndex: number) => (
              <tr key={row._id}>
                <td>
                  {(data.length !== 1 && rowIndex !== data.length - 1) && isSelectable && (
                    <CheckRadio type="checkbox" id={`row-${rowIndex}`} value={row._id} checked={selected.includes(row._id)} onChange={onSelect} />
                  )}
                </td>
                {props.columns.map((row: any, colIndex: number) => (
                  (row.type != "hidden"
                    ? <td key={row.label}><Textbox type="text" esize="sm" rounded="sm" placeholder={row.label} data-row={rowIndex} data-col={colIndex} data-field={row.name} onChange={onChange} /></td>
                    : "")
                ))}
                <td className="w-[40px]">
                  {(data.length !== 1 && rowIndex !== data.length - 1) &&
                    <button
                      className="rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit w-[20px]"
                      type="button"
                      data-index={rowIndex}
                      onClick={onDelete}
                    >
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600"/>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-trash2 lucide-trash-2 text-red-500 hover:text-red-600"
                        aria-hidden="true"
                      >
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg> */}
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <textarea
          className="form-control w-100 mt-3 d-none"
          name={props.name}
          cols={30}
          rows={10}
          readOnly={true}
          spellCheck={false}
          value={JSON.stringify(data)}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}