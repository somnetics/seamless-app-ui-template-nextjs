import Link from "next/link";
// import SimpleBar from 'simplebar-react';
import React, { useState, useEffect, useCallback, useRef, JSX } from "react";
import { useRouter } from "next/router";
import { debounce } from "@/libs/functions";
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
import DropDown, { OptionType } from "../Dropdown";
import CheckRadio from "../CheckRadio";
import Textbox from "../Textbox";
import Pagination from "../Pagination";
import { apiFetch } from "@/libs/apiClient";
import { twMerge } from "tailwind-merge";
import TabContent from "../TabContent";

// define column type
type ColumnType = {
  name: string;
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

// define sort order type
type SortOrder = "asc" | "desc";

// define order by type
type OrderBy = {
  [key: string]: SortOrder;
};

// define search field type
type SearchField = {
  [key: string]: string;
};

// define pagination option type
export type SearchOptions = {  
  columns: ColumnType[]
  endpoint?: string | undefined,
  orderBy?: OrderBy | undefined,
  recordsPerPage?: number | undefined;  
  searchable?: boolean | undefined,
  onFetch?: Function | undefined,  
  actions?: ActionType[] | undefined,
  
  // className?: string | undefined,
  style?: any | undefined,
  // permissions?: any | undefined,

  primaryField?: string | undefined;

  isSearchParameters?: boolean | undefined;
  searchParamsKey?: string | undefined;
  isSearchQuery?: boolean | undefined;
  isSelectable?: boolean | undefined;
  favorite?: boolean | undefined;

  session: SessionData;
}

export default function SearchTable({  
  columns = [],
  endpoint,
  orderBy,
  recordsPerPage = 50,  
  searchable = true,
  actions,
  searchParamsKey = "params",

  isSelectable = true,
  favorite = true,
  primaryField = "id",
  isSearchParameters = true,
  isSearchQuery = false,
  style,
  session
}: SearchOptions) {
  // const storeContext = useContext(StoreContext);
  const { showProgress } = useProgress();
  const { theme } = useGlobalState();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  // const [totalRecords, setTotalRecords] = useState<number>(0);
  // const [pageCount, setPageCount] = useState<number>(0);

  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(recordsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // const [pageNavs, setPageNavs] = useState<any>([]);

  const [searchFields, setSearchFields] = useState<SearchField>();
  const [searchUrl, setSearchUrl] = useState<string>();
  const [isSearch, setIsSearch] = useState<boolean>(true);
  // const [orderBy, setOrderBy] = useState<string>(options.orderBy ?? "");
  // const [orderBy, setOrderBy] = useState<any>(() => Object.fromEntries(options.columns.map((col: any) => [col.value, col.order])))
  const [trash, setTrash] = useState<boolean>(false);
  const [favourites, setFavourites] = useState<any[]>([]);

  const [showMenu, setShowMenu] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  // const [recordsPerPageLimit, setRecordsPerPageLimit] = useState<number>(recordsPerPage);

  const containerRef = useRef<HTMLDivElement>(null);

  // set default permissions
  // if (typeof options.permissions === "undefined") options.permissions = { Create: true, Read: true, Update: true, Delete: true };

  const router = useRouter();

  async function searchData(url: string) {
    // activate page progress
    showProgress(true);

    try {
      // call api
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });

      // call api response
      const response = await apiFetch(session, url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // get response data
      const data = await response.json();
      // const data = response.json();

      // handle success
      setData(data.results);

      // set total records
      setTotal(data.total);

      // get total pages      
      // const totalPages = Math.ceil(data.total / recordsPerPageLimit);

      // set page count
      // setPageCount(totalPages);

      // get pagination navs
      // const navs = getPages(Number(currentPage), Number(totalPages));

      // set page navs
      // setPageNavs(navs);

      // pause
      setTimeout(() => {
        // activate page progress
        showProgress(false);
      }, 250);
    } catch (e: any) {
      console.log(e.message);

      // clear data
      setData([]);

      setTotal(0);
      setLimit(recordsPerPage)
      setCurrentPage(1);

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
    // if (options.searchable === false) {
    //   // get selected fields
    //   selectedFields = options.columns.map((item, id: number) => ({
    //     name: item.name,
    //     value: router.query[item.key] || item.defaultValue,
    //     type: item.type?.toLowerCase(),
    //     alias: item.alias ?? ""
    //   }));
    // } else {
    //   // loop search fields
    //   document.querySelectorAll(".search-field").forEach((element) => {
    //     // get field
    //     const field = element as HTMLInputElement;

    //     // if not empty field value
    //     if (field.value.trim() !== "") {
    //       // append field value
    //       selectedFields.push({
    //         name: field.name,
    //         value: field.value,
    //         type: field.dataset.type?.toLowerCase(),
    //         alias: field.dataset.alias
    //       })
    //     }
    //   });
    // }

    // set selected fields
    // setsearchFields(selectedFields);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    // get element
    const { name, value } = e.target;

    // reset current page
    setCurrentPage(1);

    // set search
    setIsSearch(true);

    // set data
    setSearchFields(prevState => ({
      ...prevState,
      [name]: value
    }));
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

      columns.forEach((item) => {
        if (sort.field == item.name) { sortStruct[`${item.label}`] = `${sort.order}` };
      });

      console.log(sortStruct)
      // setOrderBy(sortStruct);
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
    // on enter
    if (e.key == "Enter") {
      // prevent from submit
      e.preventDefault();

      // reset current page
      setCurrentPage(1);

      // set search
      setIsSearch(true);
    } else {
      // get element
      const { name, value } = e.currentTarget;

      // set search
      setIsSearch(false);

      // set data
      setSearchFields(prevState => ({
        ...prevState,
        [name]: value
      }));
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

    // hide menu modal
    if (selected.length == 0) {
      setShowMenu(false)
    }
  }, [selected]);

  useEffect(() => {
    // hide menu modal when clicked outside
    showMenu ? containerRef?.current?.focus() : "";
  }, [showMenu]);

  useEffect(() => {
    // if endpoint
    if (typeof endpoint !== "undefined" && endpoint.trim() !== "") {
      console.log(endpoint);
      // clear data
      // setData([]);
     
      if (endpoint !== searchUrl) {
        // setData([]);
        setSelected([])
        setTotal(0);
        setLimit(recordsPerPage)
        setCurrentPage(1);
        setSearchUrl(endpoint)
      }
      

      // get url from endpoint
      const endpointUrl = new URL(`${window.origin}${endpoint}`);

      // extract endpoint
      const url = new URL(`${endpointUrl.origin}${endpointUrl.pathname}`);

      // loop params
      endpointUrl.searchParams.forEach((value: string, key: string) => {
        // add page params to search params
        url.searchParams.append(key, value.toString());
      });

      // if search fields
      if (searchFields) {
        // get filtered search field
        const result = Object.fromEntries(
          Object.entries(searchFields).filter(([_, value]) => value !== "")
        );

        // add table struct to search params      
        url.searchParams.append(`${searchParamsKey}`, btoa(JSON.stringify(result)));
      }

      // set offset
      const offset = limit * (currentPage - 1);

      // add page offset
      url.searchParams.append("offset", offset.toString());

      // add page limit
      url.searchParams.append("limit", limit.toString());      

      // search data
      if (isSearch) searchData(url.toString());
    }
  }, [endpoint, currentPage, searchFields, isSearch, trash, orderBy, limit]); 

  return (
    <>
      <div className="rounded-md shadow overflow-hidden bg-white dark:bg-slate-800">
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
        <div className="card-body1">
          <div className="data-table" style={style}>
            {/* <SimpleBar className={"table-responsive" + (totalRecords == 0 ? " no-record-found" : "")} autoHide={true} style={options.style}> */}
            <OverlayScrollbarsComponent className={"table-responsive" + (total == 0 ? " no-record-found" : "")} options={{ scrollbars: { autoHide: "leave", theme: (theme) == "dark" ? "os-theme-light" : "os-theme-dark" } }}>
              {/* <div className="flex --items-center justify-between 1py-2 1px-3 table-container overflow-x-auto custom-scroll" style={options.style}> */}
              <div className="flex-table">
                {searchable ?
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
                        <div className="flex-table-col w-[70px]"></div>
                        {
                          columns.map((item: any, id: number) => (
                            <div key={id} data-field={item.key} data-order="" data-alias={item.alias ?? ""} className={"flex-table-col sorting" + (total > 0 ? "" : " disable")} onClick={handleSorting} style={{ width: item.width ?? "auto" }}>{item.label}</div>
                          ))
                        }
                        {actions ?
                          <div className="flex-table-col w-25"></div>
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
                        <div className="flex-table-col" tabIndex={-1}>
                          <div className="flex items-center justify-between gap-2">
                            <CheckRadio
                              type="checkbox"
                              id="select-all"
                              onChange={onSelect}
                              checked={allSelected}
                            />
                            {selected.length !== 0
                              ? <div
                                className={`dark:text-slate-200`}
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
                              :
                              <Link href="#" className="flex">
                                <RotateCw size={16} onClick={refresh} />
                              </Link>
                            }
                          </div>
                        </div>
                      )}

                      {columns.map((item, id: number) => (
                        <div key={id} className="flex-table-col">
                          {item.type == "select" && item.options ?
                            <select className="form-control search-field w-100" name={item.name} data-alias={item.alias ?? ""} onChange={onChange} defaultValue={router.query[item.name] || item.defaultValue} data-default={router.query[item.name] || item.defaultValue} data-type={item.type}>
                              {item.options.map((item: any, id: number) => (
                                <option key={id} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                            : item.type == "date" ?
                              <input
                                className="form-control search-field w-100"
                                type="date"
                                name={item.name}
                                onChange={onChange}
                                placeholder={item.label}
                                autoComplete="off"
                                defaultValue={router.query[item.name] || item.defaultValue}
                                data-default={router.query[item.name] || item.defaultValue}
                                data-type={item.type}
                                data-alias={item.alias ?? ""}
                              />
                              : item.type == "text" || typeof item.type == "undefined" ?
                                <Textbox
                                  type="text"
                                  name={item.name}
                                  onKeyUp={onKeyUp}
                                  placeholder={item.label}
                                  autoComplete="off"
                                  defaultValue={router.query[item.name] || item.defaultValue}
                                  data-default={router.query[item.name] || item.defaultValue}
                                  data-type={item.type}
                                  data-alias={item.alias ?? ""}
                                />
                                : ""
                          }
                        </div>
                      ))}
                      {actions ?
                        <div className="flex-table-col text-center">
                          Action
                        </div>
                        : ""}
                    </div>
                  </>
                  :
                  <div className="flex-table-header">
                    {actions ?
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
                            {/* {options.permissions?.Delete ?
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
                          </li> */}
                          </ul>
                        </div>
                      </div>
                      : ""}

                    {
                      columns.map((item, id: number) => (
                        <div
                          key={id}
                          data-field={item.name}
                          data-order=""
                          data-alias={item.alias ?? ""}
                          className={"flex-table-col" + (total > 0 ? " " : " disable")}
                          onClick={handleSorting}
                          style={{ width: item.width ?? "auto" }}
                        >
                          {item.label}
                        </div>
                      ))
                    }
                    {actions ?
                      <div className="flex-table-col text-center w-25">
                        Action
                      </div>
                      : ""}
                  </div>
                }
                <div className={`flex-table-body ${searchable ? "" : "no-padding"}`} style={{ overflow: "auto" }}>
                  {data && data.map((row: any, rowNumber: number) => (
                    <div key={rowNumber} className="flex-table-row">
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
                        <div className="flex-table-col" tabIndex={-1}>
                          <div className="flex items-center justify-between">
                            <CheckRadio
                              type="checkbox"
                              id={"row-" + rowNumber}
                              value={row[primaryField]}
                              checked={selected.includes(row[primaryField].toString())}
                              onChange={onSelect}
                            />
                            <Star
                              data-id={"row-" + rowNumber}
                              className={`
                                  ${favourites.includes("row-" + rowNumber)
                                  ? "fill-amber-400 text-amber-400 transition-all duration-100 animate-[pulse_0.5s_ease]"
                                  : "text-slate-500"}
                                `}
                              size={16}
                              onClick={addFavourites}
                            />
                          </div>
                        </div>
                      )}
                      {favorite && false && (
                        // <div className="flex-table-col" style={{ width: "45px" }} onKeyUp={onKeyUp}>
                        <div className="flex-table-col" style={{ width: "45px" }}>
                          <Star
                            data-id={"row-" + rowNumber}
                            className={`
                                ${favourites.includes("row-" + rowNumber)
                                ? "fill-amber-400 text-amber-400 transition-all duration-100 animate-[pulse_0.5s_ease]"
                                : "text-slate-500"}
                              `}
                            size={16}
                            onClick={addFavourites}
                          />
                        </div>
                      )}
                      {columns.map((item, colNumber: number) =>
                        <div key={`${rowNumber}-${colNumber}`} className="flex-table-col">
                          {typeof item.render !== "undefined" ?
                            item.render(row[item.name], row)
                            :
                            row[item.name]
                          }
                        </div>
                      )}
                      {actions && (
                        <div className="flex-table-col text-center">
                          <div className="flex items-center justify-center gap-3">
                            {actions.map((action, index) =>
                              <button className={twMerge("btn-action group")} key={index} title={action.label} onClick={(e) => action.onClick(e, row)} disabled={selected.includes(row[primaryField])}>{action.icon}</button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* </div> */}
            </OverlayScrollbarsComponent>
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer1 grid px-4 py-2.5 text-sm border-top">
          <Pagination
            total={total}
            limit={limit}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setCurrentPage(1);
              setIsSearch(true);
            }
            }
            siblingCount={2}
          />
        </div>
      </div>
    </>
  )
}