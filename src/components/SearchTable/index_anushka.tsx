import Link from "next/link";
// import SimpleBar from 'simplebar-react';
import { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { render } from "@/libs/functions";
// import StoreContext from "@/context/StoreContext";
import { SessionData } from "@/libs/session";
import { useProgress } from "@/components/Progress";
import moment from "moment-timezone";
moment.tz.setDefault('Asia/Kolkata');
// import 'simplebar-react/dist/simplebar.min.css';
import { ChevronLeft, ChevronRight, EllipsisVertical, RotateCw, Star } from "lucide-react";
import { useGlobalState } from "@/context/globalState";
import "overlayscrollbars/overlayscrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import Button from "../Button";
import DropDown from "../Dropdown";
import CheckRadio from "../CheckRadio";
import Textbox from "../Textbox";


// define pagination option type
export type PaginationOptions = {
  columns: any
  endpoint?: string,
  // orderBy?: string,
  orderByKey?: string,
  recordsPerPage: number,
  tabs?: boolean,
  searchable?: boolean,
  onFetch?: Function,
  onEdit?: (e: any) => void,
  actions?: any,
  actionWidth?: string,
  className?: string,
  style?: any,
  permissions?: any,

  primaryField?: string;

  isSearchParameters?: boolean | undefined;
  searchParamsKey?: string | undefined;
  isSearchQuery?: boolean | undefined;
  isSelectable?: boolean | undefined;
  favorite?: boolean | undefined;

  session: SessionData;
}

export default function Pagination({ isSelectable = true, favorite = true, primaryField = "id", isSearchParameters = true, isSearchQuery = false, ...options }: PaginationOptions) {
  // const storeContext = useContext(StoreContext);
  const { showProgress } = useProgress();
  const { theme } = useGlobalState();


  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageNavs, setPageNavs] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFields, setsearchFields] = useState<any>([]);
  // const [orderBy, setOrderBy] = useState<string>(options.orderBy ?? "");
  const [orderBy, setOrderBy] = useState<any>(() => Object.fromEntries(options.columns.map((col: any) => [col.value, col.order])))
  const [trash, setTrash] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<any[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [recordsPerPageLimit, setRecordsPerPageLimit] = useState<number>(options.recordsPerPage)


  const containerRef = useRef<HTMLDivElement>(null);

  // set default permissions
  // if (typeof options.permissions === "undefined") options.permissions = { Create: true, Read: true, Update: true, Delete: true };

  const router = useRouter();

  async function searchData(url: string) {
    // activate page progress
    showProgress(true);

    try {
      // call api
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // get response data
      const data = await response.json();

      // handle success
      setData(data.results);

      // set total records
      setTotalRecords(data.total);

      // get total pages
      // const totalPages = Math.ceil(data.total / options.recordsPerPage);
      const totalPages = Math.ceil(data.total / recordsPerPageLimit);

      // set page count
      setPageCount(totalPages);

      // get pagination navs
      const navs = getPages(Number(currentPage), Number(totalPages));

      // set page navs
      setPageNavs(navs);

      // if on fetch
      if (typeof options.onFetch === "function") {
        // on fetch
        options.onFetch(data);
      }

      // pause
      setTimeout(() => {
        // activate page progress
        showProgress(false);
      }, 250);
    } catch (e: any) {
      console.log(e.message);

      showProgress(false);
    }
  }

  function toogleTab(e: any) {
    e.preventDefault();

    // clear data
    setData([]);

    // loop search fields
    document.querySelectorAll(".search-field").forEach((element) => {
      // get field
      const field = element as HTMLInputElement;

      // reset field value
      field.value = field.dataset.default ?? "";
    });

    // on search
    onSearch();

    // set trash status
    setTrash(e.target.dataset.id == "trash" ? true : false);
  }

  function onSearch() {
    // let selected fields
    let selectedFields: any = [];

    // if search is disabled
    if (options.searchable === false) {
      // get selected fields
      selectedFields = options.columns.map((item: any, id: number) => ({
        name: item.name,
        value: router.query[item.key] || item.defaultValue,
        type: item.type?.toLowerCase(),
        alias: item.alias ?? ""
      }));
    } else {
      // loop search fields
      document.querySelectorAll(".search-field").forEach((element) => {
        // get field
        const field = element as HTMLInputElement;

        // if not empty field value
        if (field.value.trim() !== "") {
          // append field value
          selectedFields.push({
            name: field.name,
            value: field.value,
            type: field.dataset.type?.toLowerCase(),
            alias: field.dataset.alias
          })
        }
      });
    }

    // set selected fields
    setsearchFields(selectedFields);
  }

  function onChange(e: any) {
    // search data
    onSearch();
  }

  function onSubmit(e: any) {
    // on enter
    if (e.key == "Enter") {
      // search data
      onSearch();
    }
  }

  function getPages(c: number, m: number) {
    let current = c,
      last = m,
      delta = 1,
      left = current - delta,
      right = current + delta + 1,
      range = [],
      rangeWithDots = [],
      l;

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || i >= left && i < right) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  function handleSorting(e: any) {
    e.preventDefault();

    // get all sortinf fields
    const sortingFields = document.querySelectorAll(".flex-table-col[class*=sorting]");

    // loop sort fields
    sortingFields.forEach((field: any) => {
      // if not current field
      if (field != e.target) {
        // reset sorting state
        field.className = "flex-table-col sorting";
      }
    });

    // get field alias
    const alias = e.target.dataset.alias.trim();

    // let default sort
    let sort = { field: `${alias != "" ? `${alias}.` : ""}${e.target.dataset.field}`, order: "" };

    // set current field sorting
    if (e.target.classList.contains("sorting")) {
      // remove / add class
      e.target.classList.remove("sorting");
      e.target.classList.add("sorting_asc");

      // set sorting order
      sort.order = "asc";
    } else if (e.target.classList.contains("sorting_asc")) {
      // remove / add class
      e.target.classList.remove("sorting_asc");
      e.target.classList.add("sorting_desc");

      // set sorting order
      sort.order = "desc";
    } else if (e.target.classList.contains("sorting_desc")) {
      // remove / add class
      e.target.classList.remove("sorting_desc");
      e.target.classList.add("sorting_asc");

      // set sorting order
      sort.order = "asc";
    }

    const sortStruct: any = { ...orderBy };

    // if order
    if (sort.order !== "") {
      // add page value to search params
      // setOrderBy(`${sort.field}:${sort.order}`);

      options.columns.forEach((item: any) => {
        if (sort.field == item.key) { sortStruct[`${item.value}`] = `${sort.order}` };
      });

      console.log(sortStruct)
      setOrderBy(sortStruct);
    }
  }

  function refresh(e: any) {
    e.preventDefault();

    // search data
    onSearch();
  }

  // on check checkbox
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {

    // get element
    const { checked, id, value } = e.target;

    // if select all
    if (id == "select-all") {
      // if selecteds
      if (checked) {
        // select all rows        
        setSelected(data.map((row: any) => row[primaryField].toString()));
      } else {
        // unselect all rows
        setSelected([]);
      }
    } else {
      // if selected
      if (checked) {
        // add selected row to list
        setSelected((prevKeys) => ([...prevKeys, value]));
      } else {
        // remove selected row from list
        setSelected((prevKeys) => prevKeys.filter(key => key !== value));
      }
    }
  }

  // add to favourites
  const addFavourites = (e: React.MouseEvent<SVGSVGElement>) => {
    const id = e.currentTarget.dataset.id;
    setFavourites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  // on click on menu ellipsis
  const onClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();

    containerRef.current?.focus();
    setShowMenu(!showMenu);
  }

  // on keyup from keyboard
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // get element
    const { name, value } = e.currentTarget;

    if (e.key == "Enter") {
      // prevent from submit
      e.preventDefault();

      // fetch data
      searchData
    } else {
      // set search params 
      // setSearchParams(name, value);
    }
  }

  // on blur
  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (e.relatedTarget) {
      return;
    }
    setShowMenu(false);
  }

  // on mousedown
  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    if (e.relatedTarget) {
      return;
    }

  }

  async function onEdit(e: any) {
    e.preventDefault();

    if (typeof options.onEdit === "function") {
      options.onEdit(e);
    } else {
      router.push(`${router.pathname}/${e.target.dataset.id}`);
    }
  }

  async function onDelete(e: any) {
    e.preventDefault();

    // storeContext.askConfirm({
    //   title: "Are you sure?",
    //   message: `Would you like to ${trash ? "delete" : "trash"} this item!`,
    //   label: `Yes, ${trash ? "delete" : "trash"} it!`,
    //   color: trash ? "danger" : "warning",
    //   callback: async (isConfirm: boolean) => {
    //     if (isConfirm) {
    //       // activate page progress
    //       storeContext.setPageProgress(true);

    //       // get url from endpoint
    //       const endpoint = new URL(`${window.origin}${options.endpoint}`);

    //       // call api
    //       const response = await fetch(`${endpoint.origin}${endpoint.pathname}/${e.target.dataset.id}`, {
    //         method: 'DELETE',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         }
    //       })

    //       // get response data
    //       const data = await response.json();

    //       setTimeout(() => {
    //         // deactivate page progress
    //         storeContext.setPageProgress(false);

    //         // let response
    //         let response = {};

    //         // on error
    //         if (data.status == "error") {
    //           // set response
    //           response = {
    //             color: "danger",
    //             message: data.message
    //           }
    //         } else {
    //           // set response
    //           response = {
    //             color: data.status,
    //             message: data.message
    //           }
    //         }

    //         // show message
    //         storeContext.openToast(response);

    //         // search data
    //         onSearch();
    //       }, 500);
    //     }
    //   }
    // });
  }

  async function onRestore(e: any) {
    e.preventDefault();

    // storeContext.askConfirm({
    //   title: "Are you sure?",
    //   message: "Would you like to restore this item!",
    //   label: "Yes, delete it!",
    //   color: "success",
    //   callback: async (isConfirm: boolean) => {
    //     if (isConfirm) {
    //       // activate page progress
    //       storeContext.setPageProgress(true);

    //       // get url from endpoint
    //       const endpoint = new URL(`${window.origin}${options.endpoint}`);

    //       // call api
    //       const response = await fetch(`${endpoint.origin}${endpoint.pathname}/${e.target.dataset.id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ restore: true })
    //       })

    //       // get response data
    //       const data = await response.json();

    //       setTimeout(() => {
    //         // deactivate page progress
    //         storeContext.setPageProgress(false);

    //         // let response
    //         let response = {};

    //         // on error
    //         if (data.status == "error") {
    //           // set response
    //           response = {
    //             color: "danger",
    //             message: data.message
    //           }
    //         } else {
    //           // set response
    //           response = {
    //             color: data.status,
    //             message: data.message
    //           }
    //         }

    //         // show message
    //         storeContext.openToast(response);

    //         // search data
    //         onSearch();
    //       }, 500);
    //     }
    //   }
    // })
  }

  function onNavigate(e: any) {
    e.preventDefault();

    // get element
    const nav = e.target as HTMLLinkElement;

    // set current page
    setCurrentPage(Number(nav.dataset.page) || 1);
  }

  useEffect(() => {
    // on first load
    if (!loaded) {
      // search data
      onSearch();

      // set loaded to true
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // select all when all checked
    (data.length !== 0) && (
      setAllSelected((selected.length == data.length) ? true : false)
    )
    console.log(selected)

    // hide menu modal
    if (selected.length == 0) {
      setShowMenu(false)
    }
  }, [selected]);

  useEffect(() => {
    // hide menu modal when clicked outside
    showMenu ? containerRef?.current?.focus() : "";
  }, [showMenu])

  useEffect(() => {
    // if endpoint
    if (typeof options.endpoint !== "undefined" && options.endpoint.trim() !== "" /*&& searchFields.length*/) {
      // get url from endpoint
      // const endpoint = new URL(`${window.origin}${options.endpoint}`);
      const endpoint = new URL(`http://172.30.10.27:9090${options.endpoint}`);
      // console.log(endpoint)

      // extract endpoint
      const url = new URL(`${endpoint.origin}${endpoint.pathname}/search`);

      // loop params
      endpoint.searchParams.forEach((value: string, key: string) => {
        // add page params to search params
        url.searchParams.append(key, value.toString());
      });

      // add page value to search params
      // url.searchParams.append("page", currentPage.toString());

      // add page value to search params
      // url.searchParams.append("size", options.recordsPerPage.toString());
      // url.searchParams.append("size", recordsPerPageLimit.toString());

      // add page value to search params
      // url.searchParams.append("trash", trash.toString());

      // let table structure
      const searchStruct: any = {};

      // add search fields
      searchFields.forEach((field: any) => {
        // check field name and value
        if (typeof field.name !== "undefined" && typeof field.value !== "undefined") {
          // get field alias
          const alias = field.alias.trim();

          // add field key value to search params
          // url.searchParams.append(`${alias != "" ? `${alias}.` : ""}${field.name}`, field.value);

          // push field info
          // struct.push({
          //   name: `${alias != "" ? `${alias}.` : ""}${field.name}`,
          //   type: field.type
          // });

          options.columns.forEach((item: any) => {
            item.key == field.name ? searchStruct[`${item.value}`] = field.value : "";
          });
        }
      });

      // add table struct to search params
      // url.searchParams.append("struct", JSON.stringify(struct));
      url.searchParams.append(`${options.searchParamsKey}`, JSON.stringify(searchStruct));

      // add page value to search params
      // url.searchParams.append("order_by", orderBy);
      console.log(orderBy)
      url.searchParams.append(`${options.orderByKey}`, JSON.stringify(orderBy));

      // search data
      searchData(url.toString());
    }
  }, [options.endpoint, currentPage, trash, searchFields, orderBy, recordsPerPageLimit]);

  useEffect(() => {
    setCurrentPage((router.query.page as unknown as number) || 1);
  }, [router.query.page]);

  // useEffect(() => {
  //   if (storeContext.searchReload == true) {
  //     // search data
  //     onSearch();

  //     // reset search reload status
  //     storeContext.setSearchReload(false);
  //   }

  // }, [storeContext.searchReload]);

  return (
    <div className={`card${typeof options.className !== "undefined" ? " " + options.className : ""}`}>

      {/* Card Header */}
      {options.tabs !== false ?
        <div className="card-head border-bottom px-3">
          <ul className="nav nav-underline">
            {/* <li className="nav-item cursor-pointer">
              <a className="nav-link active" data-id="records" data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="records" aria-selected="true">Records</a>
            </li>
            <li className="nav-item cursor-pointer">
              <a className="nav-link active" data-id="favourites" data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="favourites" aria-selected="true">Favourites</a>
            </li> */}
            {options.permissions?.Delete ?
              <li className="nav-item">
                <a className="nav-link" data-id="trash" data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="trash" aria-selected="true">Trash</a>
              </li>
              : ""}
          </ul>
        </div>
        : ""}
      {/* {isSearchQuery && (
        <div className="flex w-3/12">
          <Textbox
            type="search"
            esize="sm"
            rounded="sm"
            placeholder="Search Data"
            onChange={onSearch}
          />
        </div>
      )} */}

      {/* Card Body */}
      <div className="card-body p-0">
        <div className="data-table">
          {/* <SimpleBar className={"table-responsive" + (totalRecords == 0 ? " no-record-found" : "")} autoHide={true} style={options.style}> */}
          <OverlayScrollbarsComponent className={"table-responsive" + (totalRecords == 0 ? " no-record-found" : "")} style={options.style} options={{ scrollbars: { autoHide: "leave", theme: (theme) == "dark" ? "os-theme-light" : "os-theme-dark" } }}>
            {/* <div className="flex --items-center justify-between 1py-2 1px-3 table-container overflow-x-auto custom-scroll" style={options.style}> */}
            <div className="flex-table">
              {options.searchable == true || options.searchable == undefined ?
                <>
                  <div className="flex-table-header">
                    <div className="flex-table-row">
                      {/* {options.actions !== false ?
                          <div className="flex-table-col" style={{ width: "72px" }}>
                            <div className="flex align-items-center">
                              <Link href="#" className="flex me-2">
                                <i className="material-symbols-rounded text-body-emphasis icon-check">arrow_back</i>
                              </Link>
                              <Link href="#" className="flex" onClick={refresh}>
                                <i className="material-symbols-rounded text-body-emphasis icon-check">refresh</i>
                              </Link>
                            </div>
                          </div>
                          : ""} */}
                      <div className="flex-table-col" style={{ width: "72px" }}></div>
                      <div className="flex-table-col" style={{ width: "72px" }}></div>
                      {
                        options.columns.map((item: any, id: number) => (
                          <div key={id} data-field={item.key} data-order="" data-alias={item.alias ?? ""} className={"flex-table-col sorting" + (totalRecords > 0 ? "" : " disable")} onClick={handleSorting} style={{ width: item.width ?? "auto" }}>{item.value}</div>
                        ))
                      }
                      {options.actions !== false ?
                        <div className="flex-table-col"></div>
                        : ""}
                    </div>
                  </div>
                  <div className="flex-table-header">
                    {/* {options.actions !== false ?
                        <div className="flex-table-col">
                          <div className="flex align-items-center">
                            <div className="form-check mb-0 me-2">
                              <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                              <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                            </div>
                            <Link className="flex" href="#"
                              data-bs-toggle="dropdown"
                              data-bs-placement="right"
                              title=""
                              data-bs-original-title="Home">
                              <i className="material-symbols-rounded icon-check material-symbols-rounded text-body-emphasis cursor-pointer">more_vert</i>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="defaultDropdown">
                              {options.permissions?.Delete ?
                                <li>
                                  <Link href="#" className="dropdown-item flex align-items-center">
                                    Move to Trash
                                  </Link>
                                </li>
                                : ""}
                              <li>
                                <Link href="#" className="dropdown-item flex align-items-center">
                                  Add to Favourite
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        : ""} */}
                    {isSelectable && (
                      <div className="flex-table-col w-[20px] h-[47px]" style={{ width: "45px" }} tabIndex={-1}>
                        <CheckRadio
                          type="checkbox"
                          id="select-all"
                          onChange={onSelect}
                          checked={allSelected}
                        />
                      </div>
                    )}
                    {selected.length !== 0
                      ? <div
                        className={`flex-table-col dark:text-slate-200`}
                        style={{ width: "45px" }}
                        ref={containerRef}
                        tabIndex={-1}
                        onMouseDown={onMouseDown}
                        onBlur={onBlur}
                      >
                        <EllipsisVertical size={16} onClick={onClick} />
                        {showMenu && (
                          <div className="absolute left-14 mt-1 w-fit min-w-[140px] rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800/20  shadow-sm shadow-slate-400 dark:shadow-none">
                            <ul className="py-1 text-sm">
                              <li className="px-4 py-2 hover:rounded-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-normal">
                                Edit
                              </li>
                              <li className="px-4 py-2 hover:rounded-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-normal">
                                Delete
                              </li>
                              <li className="px-4 py-2 hover:rounded-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-normal">
                                Download
                              </li>
                              <li className="px-4 py-2 hover:rounded-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer font-normal">
                                Add to Starred
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      : <div className="flex-table-col p-0" style={{ width: "auto" }}>
                        <div className="flex items-center">
                          <Link href="#" className="flex">
                            <RotateCw size={20} onClick={refresh} />
                          </Link>
                        </div>
                      </div>
                    }
                    {options.columns.map((item: any, id: number) => (
                      <div key={id} className="flex-table-col">
                        {item.type == "select" && item.options ?
                          <select className="form-control search-field w-100" name={item.key} data-alias={item.alias ?? ""} onChange={onChange} defaultValue={router.query[item.key] || item.defaultValue} data-default={router.query[item.key] || item.defaultValue} data-type={item.type}>
                            {item.options.map((item: any, id: number) => (
                              <option key={id} value={item.value}>{item.label}</option>
                            ))}
                          </select>
                          : item.type == "date" || item.type == "datetime" ?
                            <input
                              className="form-control search-field w-100"
                              type="date"
                              name={item.key}
                              onChange={onChange}
                              placeholder={item.value}
                              autoComplete="off"
                              defaultValue={router.query[item.key] || item.defaultValue}
                              data-default={router.query[item.key] || item.defaultValue}
                              data-type={item.type}
                              data-alias={item.alias ?? ""}
                            />
                            :
                            <input
                              className="form-control search-field w-100"
                              type={item.type == "array" ? "text" : item.type}
                              name={item.key}
                              onKeyUp={onSubmit}
                              placeholder={item.value}
                              autoComplete="off"
                              defaultValue={router.query[item.key] || item.defaultValue}
                              data-default={router.query[item.key] || item.defaultValue}
                              data-type={item.type}
                              data-alias={item.alias ?? ""}
                            />
                        }
                      </div>
                    ))}
                    {options.actions !== false ?
                      <div className="flex-table-col text-center" style={{ width: options.actionWidth ?? "85px" }}>
                        Action
                      </div>
                      : ""}
                  </div>
                </>
                :
                <div className="flex-table-header">
                  {options.actions !== false ?
                    <div className="flex-table-col" style={{ width: "72px" }}>
                      <div className="flex align-items-center">
                        <div className="form-check mb-0 me-2">
                          <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                        </div>
                        <Link className="flex" href="#"
                          data-bs-toggle="dropdown"
                          data-bs-placement="right"
                          title=""
                          data-bs-original-title="Home">
                          <i className="material-symbols-rounded icon-check material-symbols-rounded text-body-emphasis cursor-pointer">more_vert</i>
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="defaultDropdown">
                          {options.permissions?.Delete ?
                            <li>
                              <Link href="#" className="dropdown-item flex align-items-center">
                                Move to Trash
                              </Link>
                            </li>
                            : ""}
                          <li className="border-top my-1"></li>
                          <li>
                            <Link href="#" className="dropdown-item flex align-items-center">
                              Add to Favourite
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    : ""}

                  {
                    options.columns.map((item: any, id: number) => (
                      <div
                        key={id}
                        data-field={item.key}
                        data-order=""
                        data-alias={item.alias ?? ""}
                        className={"flex-table-col" + (totalRecords > 0 ? " " : " disable")}
                        onClick={handleSorting}
                        style={{ width: item.width ?? "auto" }}
                      >
                        {item.value}
                      </div>
                    ))
                  }
                  {options.actions !== false ?
                    <div className="flex-table-col text-center" style={{ width: options.actionWidth ?? "85px" }}>
                      Action
                    </div>
                    : ""}
                </div>
              }
              <div className={`flex-table-body ${options.searchable == true || options.searchable == undefined ? "" : "no-padding"}`} style={{ overflow: "auto" }}>
                {data && data.map((row: any, id: number) => (
                  <div key={id} className="flex-table-row">
                    {/* {options.actions !== false ?
                    <div className="flex-table-col">
                      <div className="flex align-items-center">
                        <div className="form-check mb-0 me-2">
                          <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                        </div>
                        <i className="material-symbols-rounded icon-check">favorite</i>
                      </div>
                    </div>
                    : ""} */}
                    {isSelectable && (
                      <div className="flex-table-col p-0" tabIndex={-1}>
                        <CheckRadio
                          type="checkbox"
                          id={"row-" + id}
                          value={row[primaryField]}
                          checked={selected.includes(row[primaryField].toString())}
                          onChange={onSelect}
                          onKeyUp={onKeyUp}
                        />
                      </div>
                    )}
                    {favorite && (
                      // <div className="flex-table-col" style={{ width: "45px" }} onKeyUp={onKeyUp}>
                      <div className="flex-table-col" style={{ width: "45px" }}>
                        <Star
                          data-id={"row-" + id}
                          className={`
                                ${favourites.includes("row-" + id)
                              ? "fill-amber-400 text-amber-400 transition-all duration-100 animate-[pulse_0.5s_ease]"
                              : "text-slate-500"}
                              `}
                          size={15}
                          onClick={addFavourites}
                        />
                      </div>
                    )}
                    {options.columns.map((item: any, id: number) =>
                      typeof item.link !== "undefined" ? (
                        <div key={item.key} className="flex-table-col">
                          {typeof item.render !== "undefined" ?
                            item.render(row[item.key], row, item)
                            :
                            <Link href={render(item.link, row)}>
                              {row[item.key]}
                            </Link>
                          }
                        </div>
                      ) : (
                        <div key={item.key} className="flex-table-col">
                          {typeof item.render !== "undefined" ?
                            item.render(row[item.key], row, item)
                            :
                            row[item.key] !== null ? item.type == "date" ? moment(row[item.key]).format("DD-MM-YYYY") : item.type == "datetime" ? moment(row[item.key]).format("DD-MM-YYYY HH:mm") : Array.isArray(row[item.key]) ? row[item.key].join(", ") : row[item.key] : ""
                          }
                        </div>
                      )
                    )}
                    {options.actions !== false ?
                      <div className="flex-table-col">
                        <div className="flex align-items-center justify-content-evenly">
                          {trash ?
                            options.permissions?.Delete ?
                              <Link href="#" onClick={onRestore} data-id={row.id} className="flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Restore">
                                <i className="material-symbols-rounded text-success icon-check pe-none">history</i>
                              </Link>
                              : ""
                            : typeof options.onEdit === "function" ?
                              options.permissions?.Update ?
                                <Link href="#" onClick={onEdit} data-id={row.id} className="flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                  <i className="material-symbols-rounded text-body-emphasis icon-check pe-none">edit_note</i>
                                </Link> : ""
                              : ""
                          }

                          {typeof options.actions !== "undefined" ? options.actions.map((action: any, i: number) => (
                            <Link key={i} href="#" onClick={action.onClick} data-id={row.id} className="flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title={action.title}>
                              <i className={`material-symbols-rounded ${typeof action.color !== "undefined" ? action.color : 'text-body-emphasis'} icon-check pe-none`}>{action.icon}</i>
                            </Link>
                          )) : ""}

                          {options.permissions?.Delete ?
                            <Link href="#" onClick={onDelete} data-id={row.id} className="flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title={trash ? "Delete" : "Trash"}>
                              <i className={`material-symbols-rounded ${trash ? 'text-danger' : 'text-warning'} icon-check pe-none`}>{trash ? 'delete_forever' : 'delete'}</i>
                            </Link>
                            : ""}
                        </div>
                      </div>
                      : ""}
                  </div>
                ))}
              </div>
            </div>
            {/* </div> */}
          </OverlayScrollbarsComponent>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer px-4 py-2.5 text-sm flex items-center justify-between flex-sm-row flex-column border-top bg-slate-100 dark:bg-slate-700">
        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
          {/* {totalRecords > 0
            ? `Showing ${currentPage * options.recordsPerPage - (options.recordsPerPage - 1)} 
               to ${options.recordsPerPage * currentPage > totalRecords
              ? totalRecords
              : options.recordsPerPage * currentPage} 
               of ${totalRecords} records`
            : "No record found"} */}
          {totalRecords > 0
            ? `Showing ${currentPage * recordsPerPageLimit - (recordsPerPageLimit - 1)} 
               to ${recordsPerPageLimit * currentPage > totalRecords
              ? totalRecords
              : recordsPerPageLimit * currentPage} 
               of ${totalRecords} records`
            : "No record found"}
        </span>
        {totalRecords > 0 ?
          <nav aria-label="Search Pagination">
            <ul className="flex items-center gap-1">
              <li className={currentPage == 1 ? "pointer-events-none cursor-not-allowed opacity-60" : ""}>
                <Link
                  href="#"
                  className="relative flex items-center rounded-l-lg px-4 py-2 text-sm font-medium bg-transparent hover:bg-slate-500/70"
                  onClick={onNavigate}
                  data-page={currentPage - 1}
                >
                  <ChevronLeft size={16} />
                  Prev
                </Link>
              </li>
              {
                pageNavs.map((p: any, i: number) => (
                  <li key={i} className={currentPage == p ? "dark:bg-slate-900/45 dark:text-white py-1 px-1.5 rounded-sm" : "hover:bg-slate-300 dark:hover:bg-slate-600 py-1 px-1.5 rounded-sm"}>
                    {p == "..." ?
                      <Link className="page-link text-muted" href="#" onClick={(e: any) => { e.preventDefault() }}>{p}</Link>
                      :
                      <Link className="page-link" href="#" onClick={onNavigate} data-page={p}>{p}</Link>
                    }
                  </li>
                ))
              }
              <li className={(currentPage == pageCount ? "pointer-events-none cursor-not-allowed opacity-60" : "")}>
                <Link
                  className="relative flex items-center rounded-r-lg px-4 py-2 text-sm font-medium bg-transparent hover:bg-slate-500/70"
                  href="#"
                  onClick={onNavigate}
                  data-page={currentPage + 1}
                >
                  Next
                  <ChevronRight size={16} />
                </Link>
              </li>
            </ul>
          </nav>
          : ""}
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
          Show <DropDown
            className="bg-slate-500"
            options={[
              { label: "50", value: "50" },
              { label: "70", value: "70" },
              { label: "90", value: "90" },
            ]}
            esize="sm"
            style={{ width: 55, height: 30 }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRecordsPerPageLimit(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}