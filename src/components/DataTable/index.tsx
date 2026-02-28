import { useState, useEffect, JSX, CSSProperties } from "react";
import { randomId } from "@/libs/functions";
import { OptionType } from "@/components/Dropdown";
import { twMerge } from "tailwind-merge";
import { Trash2 } from "lucide-react";
import CheckRadio from "@/components/CheckRadio";
import Textbox from "@/components/Textbox";
import { SessionData } from "@/libs/session";

type ColumnType = {
  name?: string;
  value?: string;
  label: string;
  alias?: string | undefined;
  type?: "text" | "select" | "date" | "hidden";
  options?: OptionType[];
  width?: number | string | undefined;
  defaultValue?: string | undefined;
  readOnly?: boolean | undefined;
}

type DataTableProps = {
  name?: string;
  onAddFocusField?: string;
  value?: any[];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  columns: ColumnType[];
  renderField?: (value: string) => JSX.Element;
  endpoint?: string;
  method?: string;
  resultVariable?: string;
  primaryField?: string;
  isSearchable?: boolean | undefined;
  isSelectable?: boolean | undefined;
  canAppend?: boolean | undefined;
  canDelete?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;
  style?: CSSProperties | undefined;
  session?: SessionData;
};

export default function DataTable({
  method = "GET",
  primaryField = "id",
  isSearchable = true,
  isSelectable = true,
  canAppend = true,
  canDelete = true,
  recordsPerPage = 10,
  ...props
}: DataTableProps) {
  const [data, setData] = useState<{ [key: string]: string }[]>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  // load data
  async function loadData(value: any = []) {
    // let rows
    let rows: any = [];

    // check value type
    if (typeof value === "string") {
      // get values
      rows = JSON.parse(value);

      // set rows
      // rows = [...value];
    } else {
      // set rows
      // rows = [...data || [], ...value];
      rows = value;
    }

    // update rows
    rows = rows.map((row: any) => ({ _id: randomId(), ...row }))

    // // get data
    // const cols: any = { _id: _id };

    // // loop columns
    // props.columns.forEach((column: any) => {
    //   // set default column value
    //   cols[column.name] = typeof column.default !== "undefined" ? column.default : "";
    // });

    // push row
    // rows.push(cols);

    console.log(rows)

    // set data
    setData(rows);

    // select all rows        
    // setSelected((data.slice(0, -1)).map((row: any) => row._id));
    setSelected(rows.map((row: any) => row._id));

    // // on add focus field
    // if (typeof props.onAddFocusField !== "undefined") {
    //   setTimeout(() => {
    //     // newly added row field
    //     const field = document.querySelector(`[data-rowid="${_id}"]#${props.onAddFocusField}`) as HTMLInputElement;

    //     // set focus on field
    //     if (field) field.focus();
    //   }, 100);
    // }
  }

  //on select checkbox
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get element
    const { checked, id, value } = e.target;

    // if select all
    if (id == "select-all") {
      // if selected
      if (checked && data) {
        // select all rows        
        // setSelected((data.slice(0, -1)).map((row: any) => row._id));
        setSelected(data.map((row: any) => row._id));
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

  // on change
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    // prevent action
    e.preventDefault();

    // set rowId 
    const rowId = String(e.currentTarget.dataset.rowId);

    // // set field name
    const field = String(e.currentTarget.dataset.field);

    // // set field name
    const value = String(e.currentTarget.value);

    if (data) {
      // store data
      const dataList = [...data];

      // find index of target row
      const index = dataList.findIndex((row: any) => row._id == rowId);

      if (index > -1) {
        // insert data in field
        dataList[index][field] = value;

        // set data
        setData(dataList);

        // add new row
        // if (index === data.length - 1 && data[index].rows !== "") {
        //   // insert new empty row 
        //   loadData([]);

        //   // select checkbox when new row added
        //   setSelected(selected.includes(dataList[index]._id) ? selected : [...selected, data[index]._id])
        // }
      }
    }
  }

  // on delete
  function onDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    //index of row to delete
    const index = Number(e.currentTarget.dataset.index)

    // remove selected row 
    if (data) {
      // store data array of objects
      const dataList = [...data];

      // remove selected row index and update array
      dataList.splice(index, 1);

      // set data (update)
      setData(dataList)

      // store selected checkbox array
      const checked = [...selected];

      // find the index of checked row
      const id = checked.findIndex((element: string) => element == data[index]._id);

      // if checkbox selected 
      if (id > -1) {
        //update the array after deletion
        checked.splice(id, 1)

        // set selected array(update)
        setSelected(checked)
      }
    }
  }

  // set selected and data array
  useEffect(() => {
    // console.log(selected, data)
    // set all selected checkbox
    if (data && data.length) {
      setAllSelected((selected.length == data.length - 1 || selected.length == data.length) ? true : false)
    }
  }, [selected, data]);

  // load data
  useEffect(() => {
    // empty data on load
    loadData(props.value);
  }, [props.value]);

  // // on load
  // useEffect(() => {
  //   // on loaded
  //   if (data && data.length) setLoaded(true);
  // }, [data]);

  // //set columns 
  // useEffect(() => {
  //   // console.log(props.columns)
  // }, [props.columns])

  return (
    <div className="bg-white dark:bg-slate-900 -border -border-black/10 -dark:border-none rounded-md shadow overflow-hidden">
      <div className={twMerge("datatable1 data-table1")}>
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-[40px] p-2 text-center bg-slate-300/50 dark:bg-slate-800 border-b border-black/10 dark:border-white/10">
                {data && data.length > 1 && isSelectable && (
                  <CheckRadio type="checkbox" id="select-all" onChange={onSelect} checked={allSelected} className="justify-center" />
                )}
              </th>
              {props.columns.map((row: any, index: number) => (
                (row.type != "hidden"
                  ? <th className="p-2 text-left bg-slate-300/50 dark:bg-slate-800 border-b border-black/10 dark:border-white/10" key={index}>{row.label}</th>
                  : ""
                )
              ))}
              {canDelete && (
                <th></th>
              )}
            </tr>
          </thead>
          <tbody>
            {data && data.map((row: any, rowIndex: number) => (
              <tr key={row._id}>
                <td className="p-2 text-center bg-white dark:bg-slate-800 border-t border-black/10 dark:border-slate-700/80">
                  {data.length !== 1 && rowIndex !== data.length && isSelectable && (
                    <CheckRadio type="checkbox" id={`row-${row._id}`} value={row._id} checked={selected.includes(row._id)} onChange={onSelect} className="justify-center" />
                  )}
                </td>
                {props.columns.map((col: ColumnType, colIndex: number) => (
                  (col.type != "hidden" && col.name &&
                    <td key={col.label} className="p-2 text-left bg-white dark:bg-slate-800 border-t border-black/10 dark:border-slate-700/80">
                      <Textbox id={`${row._id}-${col.name}`} type="text" esize="sm" rounded="sm" placeholder={col.label} value={row[col.name]} data-row-id={row._id} data-field={col.name} onChange={onChange} readOnly={col.readOnly} />
                    </td>
                  )
                ))}
                {canDelete && (
                  <td className="w-[40px] text-center">
                    {(data.length !== 1 && rowIndex !== data.length - 1) &&
                      <button
                        className="flex items-center justify-center cursor-pointer no-underline w-[20px]"
                        type="button"
                        data-index={rowIndex}
                        onClick={onDelete}
                      >
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                      </button>
                    }
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <textarea
          className="w-100 mt-3 hidden"
          name={props.name}
          cols={30}
          rows={10}
          readOnly={true}
          spellCheck={false}
          value={JSON.stringify(Array.isArray(data) ? data.filter(item => selected.includes(item._id)) : [])}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}