import { useState, useEffect, useRef, useCallback, JSX, CSSProperties } from "react";
import { useProgress } from "@/components/Progress";
import { useModal } from '@/components/Modal';
import { SessionData } from "@/libs/session";
import { debounce } from "@/libs/functions";
import { apiFetch } from "@/libs/apiClient";
import Button from "@/components/Button";
import Textbox from "@/components/Textbox";
import DropDown, { OptionType } from "@/components/Dropdown";
import CheckRadio from "@/components/CheckRadio";
import { Icon } from "@/components/Icon";
import { twMerge } from "tailwind-merge";
import { FileDown, FunnelPlus, X } from "lucide-react";
import Textarea from '@/components/Textarea';
import { fields } from "../FomBuilder/fields";
import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";

import Pagination from "@/components/Pagination";
import { off } from "process";

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

type CategoryType = {
  category: string;
  options: string[];
}

// define prop type
type SearchTableProps = {
  columns: ColumnType[];
  endpoint?: string;
  method?: string;

  resultVariable?: string;
  totalVariable?: string;
  primaryField?: string;

  categories?: CategoryType[];
  isSearchParameters?: boolean | undefined;
  isSearchQuery?: boolean | undefined;
  isSelectable?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;

  actions?: ActionType[] | undefined;
  style: CSSProperties | undefined;
  session: SessionData;

  offset?: number;
};

// function FilterSearch({ categories }: SearchTableProps) {
//   const searchContainerRef = useRef<HTMLDivElement>(null);
//   // const isMouseDownInside = useRef<boolean>(false);

//   const [showFilters, setShowFilters] = useState<boolean>(false);
//   const [fieldsValue, setFieldsValue] = useState<string>("");
//   const [categoryList, setCategoryList] = useState<CategoryType[] | undefined>(categories)
//   const [selectedCategory, setSelectedCategory] = useState<any>();
//   // const [isChecked, setIsChecked] = useState<string[]>([]);
//   const [item, setItem] = useState<{ [category: string]: string[] }>({})

//   // on change
//   const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     // get element
//     const { name, value, type } = e.target;

//     // set data
//     setFieldsValue(value);

//     // if not text element
//     // if (type !== "text") {
//     //   // set data
//     //   setSearchQuery((prevState: any) => ({
//     //     ...prevState,
//     //     [name]: value
//     //   }));
//     // }
//   }

//   // on click
//   const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     e.preventDefault();

//     searchContainerRef.current?.focus();
//     setShowFilters(!showFilters);
//   }

//   // on reset
//   const onReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     e.preventDefault();

//     // reset search field
//     setFieldsValue("");

//     // reset category list
//     setSelectedCategory(categoryList?.[0].category);

//     // reset array
//     // setIsChecked([]);
//     setItem({});
//   }

//   //on selection
//   const onSelection = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
//     e.preventDefault();

//     //set selected item
//     setSelectedCategory(e.currentTarget.dataset.value);
//   }

//   // on blur
//   const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
//     if (e.relatedTarget) {
//       // isMouseDownInside.current = false
//       return;
//     }
//     setShowFilters(false);
//   }

//   // on check
//   const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;

//     // on check
//     if (checked) {
//       // add value to array if checked
//       // setIsChecked((prev: string[]) => ([
//       //   ...prev,
//       //   selectedCategory + ":" + value,
//       // ]));
//       setItem(prev => ({
//         ...prev,
//         [selectedCategory]: [
//           ...(prev[selectedCategory] ?? []),
//           value,
//         ],
//       }));
//     } else {
//       // remove value from array if unchecked
//       // setIsChecked(isChecked.filter((option: string) => option !== value));
//       setItem(prev => ({
//         ...prev,
//         [selectedCategory]: prev[selectedCategory]
//           ?.filter(
//             (option: string) => option !== value
//           ) ?? [],
//       }));
//     }
//   }

//   // on mousedown
//   function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
//     // e.preventDefault();

//     if (e.relatedTarget) {
//       // isMouseDownInside.current = false
//       return;
//     }
//     // isMouseDownInside.current = true;
//   }

//   useEffect(() => {
//     if (showFilters) {
//       searchContainerRef.current?.focus();
//     }
//   }, [showFilters]);

//   useEffect(() => {
//     // set selected category
//     setSelectedCategory(categoryList
//       ?.find(val =>
//         val.category.toLowerCase().includes(fieldsValue.toLowerCase())
//       )
//       ?.category ?? ""
//     )
//   }, [fieldsValue])

//   useEffect(() => {
//     // console.log(isChecked);
//     console.log(item)
//   }, [item])

//   return (
//     <>
//       <div className="filter" >
//         <Button color="secondary" size="md" className="btn border dark:border-white/10" onClick={onClick} >
//           <Icon name="Filter" size={14} />
//           <span>Filter</span>
//         </Button>
//         <div className={`${showFilters ? "show" : "hide"}`} style={{ position: "relative" }} ref={searchContainerRef} tabIndex={-1} onMouseDown={onMouseDown} onBlur={onBlur} >
//           <div className="absolute right-0 mt-2 z-50 w-[500px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-md shadow-xl">
//             <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-white/10">
//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
//                 Filter Search
//               </h3>
//               <button type="button" className="p-1 rounded-md cursor-pointer" aria-label="Close" onClick={onClick}>
//                 <X size={16} className="text-primary-500 hover:text-primary-600" />
//               </button>
//             </div>
//             <div className="flex w-full p-2 border-b border-slate-200 dark:border-white/10">
//               <Textbox type="search" name="search" esize="sm" rounded="sm" placeholder="Search Filter" value={fieldsValue} onChange={onChange} />
//             </div>
//             <div className="grid grid-cols-[220px_1fr] h-[300px]">
//               <div className="border-r border-slate-200 dark:border-white/10 p-2 space-y-2 overflow-y-auto custom-scroll">
//                 <ul>
//                   {(fieldsValue == "") && categoryList?.map((item: any, index: number) =>
//                     <li
//                       key={index}
//                       className={`px-3 py-2 rounded-md ${item.category === selectedCategory ? "bg-slate-500/45 dark:bg-slate-900/45" : ""} dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer`}
//                       data-value={item.category}
//                       onClick={onSelection}
//                     >
//                       {item.category}
//                     </li>
//                   )
//                   }
//                   {(fieldsValue !== "")
//                     && categoryList
//                       ?.filter(val => val.category.toLowerCase().includes(fieldsValue))
//                       .map((item: any, index: number) =>
//                         <li
//                           key={index}
//                           className={`px-3 py-2 rounded-md ${item.category === selectedCategory ? "bg-slate-500/45 dark:bg-slate-900/45" : ""} dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer`}
//                           data-value={item.category}
//                           onClick={onSelection}
//                         >
//                           {item.category}
//                         </li>
//                       )
//                   }
//                 </ul>
//               </div>

//               <div className="p-2 space-y-4 overflow-y-auto custom-scroll">
//                 {selectedCategory &&
//                   <h2 className="text-lg font-semibold mb-4">{selectedCategory}</h2>
//                 }
//                 <ul className="flex flex-wrap gap-1">
//                   {categories && categories
//                     .find(item => item.category === selectedCategory)
//                     ?.options
//                     .map((option: string, index: number) => (
//                       <li
//                         key={index + option}
//                       >
//                         {/* <label className={`flex items-center gap-2 p-2 ${isChecked.includes(option) ? "text-blue-600" : ""} cursor-pointer text-sm`}> */}
//                         <label className={`flex items-center gap-2 p-2 ${(item[selectedCategory] ?? []).includes(option) ? "text-blue-600" : ""} cursor-pointer text-sm`}>
//                           <input
//                             type="checkbox"
//                             value={option}
//                             data-category={selectedCategory}
//                             // checked={isChecked.includes(option)}
//                             checked={(item[selectedCategory] ?? []).includes(option)}
//                             onChange={onCheck}
//                             // className={isChecked.includes(option) ? "accent-blue-500" : ""}
//                             className={(item[selectedCategory] ?? []).includes(option) ? "accent-blue-500" : ""}
//                             readOnly
//                           />
//                           {option}
//                         </label>
//                       </li>
//                     ))
//                   }
//                 </ul>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 p-2 border-t border-slate-200 dark:border-white/10">
//               <Button size="sm" color="secondary" onClick={onReset}>Reset</Button>
//               <Button size="sm" color="primary">Apply</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

export default function SearchTable({
  columns,
  endpoint,
  method = "GET",

  resultVariable,
  totalVariable = "total",
  primaryField = "id",

  isSearchParameters = true,
  isSearchQuery = false,
  isSelectable = false,

  orderBy = "",
  recordsPerPage = 10,
  offset = 0,

  actions,
  style,
  session
}: SearchTableProps) {
  const { showProgress } = useProgress();
  const [fieldsValue, setFieldsValue] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState<any>({});
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<unknown[]>([]);
  const { showModal } = useModal();

  const fetchData = async () => {
    try {
      // activate page progress
      showProgress(true);

      // get url from endpoint
      // const endpointUrl = new URL(`${window.origin}${endpoint}`);
      const endpointUrl = new URL(`${endpoint}`);

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
      url.searchParams.append("limit", recordsPerPage.toString());

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

      // // call api response
      // const response = await apiFetch(session, url.toString(), {
      //   method: method,
      //   cache: "no-store"
      // });

      // call api
      const response = await fetch(url.toString(), {
        method: method,
        cache: "no-store"
      });

      // get response data
      const resData = await response.json();

      // set results
      // setResults(resultVariable ? response[resultVariable] : response);
      setResults(resData);

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
        setSelected(results.map((row: any) => row[primaryField].toString()));
      } else {
        // unselect all rows
        setSelected([]);
      }
    } else {
      // if selected
      if (checked) {
        console.log(selected)
        console.log(checked)
        // add selected row to list
        // setSelected([...selected, value]);
        setSelected((prevKeys) => ([...prevKeys, value]));
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
    console.log(selected.length, results.length)
    { (results.length !== 0) && setAllSelected((selected.length == results.length) ? true : false) }
  }, [selected]);

  useEffect(() => {
    console.log(results)
  }, [results])

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const formBody = <>
    <Textbox />

    <DropDown
      options={[
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]}
    />

    <Textarea rows={6} />
  </>

  return (
    <>
      <div className="flex items-center justify-between gap-2 py-3">
        <div className="flex w-3/12">
          {isSearchQuery && (
            <Textbox type="search" esize="sm" rounded="sm" placeholder="Search Data" onChange={onSearch} />
          )}
        </div>
        <div className="flex gap-2">
          {/* <FilterSearch categories={categories} columns={[]} style={style} session={session} /> */}
          <Button color="primary" size="md" className="text-white">
            <Icon name="FileDown" size={14} />
            <span>Export</span>
          </Button>
          <Button
            onClick={() => {
              showModal({
                title: "New Task", body: formBody, onSubmit: async (formData, close) => {
                  // // let updated data
                  // const taskData: any = { project: project.id, status: "1" };

                  // // get form value
                  // formData.forEach((value, key) => taskData[key] = value);

                  // // show progress
                  // showProgress(true);

                  // // submit task
                  // const data = await SubmitTask(session.token, taskData);

                  // // on error
                  // if (data._type === "Error") {
                  //   // show message
                  //   addToast(data.message, MessageTypes.Error);
                  // } else {
                  //   // show message
                  //   addToast("Task created successfully.", MessageTypes.Success, 1500);
                  // }

                  // // show progress
                  // showProgress(false);

                  // close window
                  close(true);
                }
              })
            }}

            color="success" size="md" className="text-white">
            <Icon name="Plus" size={16} />
            <span>Add New</span>
          </Button>
        </div>
      </div>
      {/* {endpoint && (
        <Pagination endpoint={endpoint} method={method} start={start} recordsPerPage={recordsPerPage} offsetVar={offsetVar} limitVar={limitVar} columns={undefined} isSelectable={isSelectable} primaryField={primaryField} />
      )} */}


      <div className="data-table">
        <div className="flex flex-col 1gap-2">
          <div className="flex items-center justify-between 1py-2 1px-3 1border-b 1border-black/10 dark:1border-white/10">
            <div className="flex items-center">
              {isSelectable && actions && (
                <div className="flex items-center gap-2">
                  {/* <Icon name="Trash" size={14} className="text-red-600 fw-bold" />                   */}
                  {/* {actions.filter((action) => typeof action.multiple == "undefined" || action.multiple == true).map((action, index) =>
                    // <Button key={index} color="secondary" size="sm" className="btn border dark:border-white/10" disabled={selected.length > 0 ? false : true}>
                    //   {action.icon}
                    //   <span>{action.label}</span>
                    // </Button>

                    // <button key={index} className="p-[9px] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button">
                    //   {action.icon}
                    // </button>

                    <button key={index} className="p-[9px] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center cursor-pointer no-underline visited:text-inherit" type="button">
                      {action.icon}
                    </button>
                  )} */}
                </div>
              )}
            </div>
          </div>
          <div className="flex --items-center justify-between 1py-2 1px-3 table-container overflow-x-auto" style={style}>
            <table className="w-full table-fixed" >
              <thead className="1border 1border-slate-700 rounded-md sticky top-0 bg-slate-500 shadow-md">
                <tr>
                  {isSelectable && (
                    <th className="w-[20px] h-[47px]">
                      <CheckRadio type="checkbox" id="select-all" onChange={onSelect} checked={allSelected} />
                    </th>
                  )}
                  {columns.map((column, index) =>
                    <th key={index} className="whitespace-nowrap h-[47px]" style={{ width: column.width ?? "auto" }}>
                      {isSearchParameters && !isSearchQuery ?
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
                    <th className="w-[100px] h-[47px] !text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="1border 1border-slate-700">
                {results.map((row: any, index: number) =>
                  <tr key={index}>
                    {isSelectable && (
                      <td>
                        <CheckRadio type="checkbox" id={"row-" + index} value={row[primaryField]} checked={selected.includes(row[primaryField].toString())} onChange={onSelect} />
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
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-700">
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 ">
            Showing <b>1</b> to <b>12</b> of <b>40</b> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-nav bg-slate-300 dark:bg-slate-600 py-1.5 px-2 rounded-sm">
              Prev
            </button>
            <button className="btn-nav hover:bg-slate-300 dark:hover:bg-slate-600 py-1 px-1.5 rounded-sm">
              1
            </button>
            <button className="btn-nav dark:bg-slate-900/45 dark:text-white py-1 px-1.5 rounded-sm">
              2
            </button>
            <button className="btn-nav hover:bg-slate-300 dark:hover:bg-slate-600 py-1 px-1.5 rounded-sm">
              3
            </button>
            <button className="btn-nav hover:bg-slate-300 dark:hover:bg-slate-600 py-1 px-1.5 rounded-sm">
              4
            </button>
            <button className="btn-nav hover:bg-slate-300 dark:hover:bg-slate-600 py-1 px-1.5 rounded-sm">
              5
            </button>
            <button className="btn-nav bg-slate-300 dark:bg-slate-600 py-1.5 px-2 rounded-sm">
              Next
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
            Show <DropDown
              options={[
                { label: "15", value: "15" },
                { label: "25", value: "25" },
                { label: "35", value: "35" },
              ]}
              style={{ width: 65 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
