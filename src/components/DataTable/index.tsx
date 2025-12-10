import Link from "next/link";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { randomId } from "@/libs/functions";
// import StoreContext from "@/context/StoreContext";
import Dropdown from "@/components/Dropdown";
import AutoComplete from "@/components/Autocomplete";

export default function DataTable({ name, columns, onAddFocusField, value, onChange }: { name: string, columns: any, onAddFocusField?: string, value?: string, onChange?: any }) {
  // const storeContext = useContext(StoreContext);

  const [data, setData] = useState<any>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

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
      columns.forEach((column: any) => {
        // set default column value
        cols[column.name] = typeof column.default !== "undefined" ? column.default : "";
      });

      // push row
      rows.push(cols);
    }

    // set data
    setData(rows);

    // on add focus field
    if (typeof onAddFocusField !== "undefined") {
      setTimeout(() => {
        // newly added row field
        const field = document.querySelector(`[data-rowid="${_id}"]#${onAddFocusField}`) as HTMLInputElement;

        // set focus on field
        if (field) field.focus();
      }, 100);
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
    const column = columns.find((column: any) => column.name == id && typeof column.onEdit == "function");

    // if callback method defined
    if (typeof column !== "undefined") {
      // get data
      const rows: any = [...data];
      const index = rows.findIndex((r: any) => r._id == rowid);

      // // cal on focus callback
      column.onEdit(rows[index], (row: any) => {
        // update data
        rows[index] = row;

        // set data
        setData(rows);
      });
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
    const column = columns.find((column: any) => column.name == id && typeof column.onBlur == "function");

    // if callback method defined
    if (typeof column !== "undefined") {
      // get data
      const rows: any = [...data];
      const index = rows.findIndex((r: any) => r._id == rowid);

      // // cal on focus callback
      column.onBlur(rows[index], (row: any) => {
        // update data
        rows[index] = row;

        // set data
        setData(rows);
      });
    }
  }

  // on change
  function _onChange(e: any) {
    e.preventDefault();

    // get data info
    const rowid = e.target.dataset.rowid;
    const id = e.target.id;

    // get value element
    const valueElement = document.querySelector(`.datatable textarea[name="${name}"]`) as HTMLTextAreaElement;

    // get data
    const rows: any = JSON.parse(valueElement.value);
    const index = rows.findIndex((r: any) => r._id == rowid);

    // if row exists
    if (index > -1) {
      // update value
      rows[index][id] = e.target.value;
    }

    // set data
    setData(rows);
  }

  useEffect(() => {
    // empty data on load
    loadData(value);
  }, [value]);

  useEffect(() => {
    // get value element
    // const valueElement = document.querySelector(`.datatable textarea[name="${name}"]`) as HTMLTextAreaElement;

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
    <div className="datatable">
      <div className="flex-table">
        <div className="flex-table-header">
          <div className="flex-table-row">
            <div className="flex-table-col text-center p-0" style={{ width: "45px" }} tabIndex={-1}>#</div>
            {columns.map((column: any, id: number) => (
              <div key={id} data-field={column.name} className={"flex-table-col" + (column.type == "hidden" ? " d-none" : "")} tabIndex={-1} style={{ width: column.width ?? "auto" }}>{column.label}</div>
            ))}
            <div className="flex-table-col bg-primary p-0" style={{ width: "45px" }}>
              <div className="d-flex align-items-center justify-content-evenly">
                <Link href="#" onClick={onAdd} className="d-flex" tabIndex={-1}>
                  <i className="material-symbols-rounded text-white icon-check pe-none">add</i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-table-body" style={{ overflow: "auto" }}>
          {data.map((row: any, id: number) => (
            <div key={id} className="flex-table-row">
              <div className="flex-table-col text-center p-0" tabIndex={-1}>{Number(id) + 1}</div>
              {columns.map((column: any, id: number) => (
                <div key={id} className={"flex-table-col p-0" + (column.type == "hidden" ? " d-none" : "")}>
                  {column.type == "select" && column.options ?
                    <select className="form-control data-field w-100" id={column.name} data-rowid={row._id} value={row[column.name]} onChange={_onChange}>
                      {column.options.map((option: any, id: number) => (
                        <option key={id} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    : column.type == "dropdown" ?
                      <Dropdown
                        className="form-control data-field w-100"
                        options={column.options}
                        // position={column.position}
                        id={column.name}
                        value={row[column.name]}
                        // rowid={row._id}
                        onChange={_onChange}
                        // onSelected={(item: any, element: any) => {
                        //   // get next element
                        //   const nextElement = element.target.closest(".flex-table-col").nextSibling.querySelector(".data-field");

                        //   // if element found
                        //   if (nextElement) {
                        //     // focus to next element
                        //     nextElement.focus();
                        //   }
                        // }}
                      />
                      : column.type == "autocomplete" ?
                        <AutoComplete
                          className="form-control data-field w-100"
                          endpoint={column.endpoint}
                          searchField={column.searchField}
                          descriptionField={column.descriptionField}
                          onSelected={(item: any, element: any) => {
                            const rows: any = [...data];
                            const index = rows.findIndex((r: any) => r._id == row._id);

                            // update data
                            rows[index] = { ...rows[index], ...item };

                            // set data
                            setData(rows);

                            // get next element
                            const nextElement = element.target.closest(".flex-table-col").nextSibling.querySelector(".data-field");

                            // if element found
                            if (nextElement) {
                              // focus to next element
                              nextElement.focus();
                            }
                          }}
                          onChange={(value: any) => {
                            const rows: any = [...data];
                            const index = rows.findIndex((r: any) => r._id == row._id);

                            // update data
                            rows[index][column.name] = value;

                            // set data
                            setData(rows);
                          }}
                          id={column.name}
                          rowid={row._id}
                          value={row[column.name]}
                        />
                        : column.type == "readonly" ?
                          <input
                            className="form-control data-field w-100"
                            type="text"
                            data-rowid={row._id}
                            id={column.name}
                            autoComplete="off"
                            readOnly={true}
                            spellCheck={false}
                            value={row[column.name]}
                            tabIndex={-1}
                          /> : column.type == "hidden" ?
                            <input
                              type="hidden"
                              data-rowid={row._id}
                              id={column.name}
                              value={row[column.name]}
                              tabIndex={-1}
                            /> : <input
                              className="form-control data-field w-100"
                              type="text"
                              data-rowid={row._id}
                              id={column.name}
                              onDoubleClick={onDoubleClick}
                              onChange={_onChange}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              autoComplete="off"
                              spellCheck={false}
                              tabIndex={column.tabIndex}
                              value={row[column.name]}
                            />
                  }
                </div>
              ))}
              <div className="flex-table-col p-0">
                <div className="d-flex align-items-center justify-content-evenly">
                  <Link href="#" onClick={onRemove} data-id={row._id} data-action="remove" className="d-flex" tabIndex={-1}>
                    <i className="material-symbols-rounded text-danger icon-check pe-none">delete_forever</i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="w-100 mt-3">
        <div className="d-flex align-items-center justify-content-evenly">
          <button className="btn btn-secondary" onClick={onAdd}>Add New Item</button>
        </div>
      </div> */}
      <textarea className="form-control w-100 mt-3 d-none" name={name} cols={30} rows={10} readOnly={true} spellCheck={false} value={JSON.stringify(data)} onChange={onChange}></textarea>
    </div>
  )
}