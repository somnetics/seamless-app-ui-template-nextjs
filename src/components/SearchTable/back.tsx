import Link from "next/link";
import { useState, useEffect, useContext, SetStateAction, Dispatch } from "react";
import { useRouter } from "next/router";
import { render } from "@/libs/functions";
import StoreContext from "@/context/StoreContext";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Kolkata");

// define pagination option type
export type PaginationOptions = {
  id?: string,
  columns: any
  endpoint?: string,
  orderBy?: string,
  recordsPerPage: number,
  tabs?: any,
  header?: boolean,
  navigation?: boolean,
  selections?: boolean,
  searchable?: boolean,
  searchOnLoad?: boolean,
  reload?: boolean,
  setReload?: Dispatch<SetStateAction<boolean>>,
  onReady?: (f: Function) => void,
  onEdit?: (e: any) => void,
  onSearch?: (data: any) => void,
  actions?: any,
  actionWidth?: string,
  style?: any,
  permissions?: any,
  controls?: JSX.Element
}

// define pagination funtion
export default function Pagination(options: PaginationOptions) {
  const storeContext = useContext(StoreContext);
  const router = useRouter();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageNavs, setPageNavs] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchFields, setsearchFields] = useState<any>([]);
  const [orderBy, setOrderBy] = useState<string>(options.orderBy ?? "");
  const [trash, setTrash] = useState<boolean>(false);
  const [tab, setTab] = useState<any>({ endpoint: "" });

  // set default permissions
  // if (typeof options.permissions === "undefined") options.permissions = { Create: true, Read: true, Update: true, Delete: true };

  async function searchData(url: string) {
    // if not loaded
    if (loaded) {
      // activate page progress
      storeContext.setPageProgress(true);

      // call api
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      // get response data
      const resData = await response.json();

      // // handle success
      setData(resData.results);

      // // set total records
      setTotalRecords(resData.total);

      // // get total pages
      const totalPages = Math.ceil(resData.total / options.recordsPerPage);

      // // set page count
      setPageCount(totalPages);

      // // get pagination navs
      const navs = getPages(Number(currentPage), Number(totalPages));

      // // set page navs
      setPageNavs(navs);

      setTimeout(() => {
        // bootstrap tooltip
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new window.bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: "hover"
          });
        });

        // deactivate page progress
        storeContext.setPageProgress(false);

        // on search
        if (typeof options.onSearch === "function") options.onSearch(resData);
      }, 500);
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

    // if not records and trash
    if (e.target.dataset.id != "records" && e.target.dataset.id != "trash") {
      // set tab
      setTab(e.target.dataset);
    }

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

  function reload() {
    // search data
    onSearch();

    // set loaded to true
    setLoaded(true);
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
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  function handleSorting(e: any) {
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

    // if order
    if (sort.order !== "") {
      // add page value to search params
      setOrderBy(`${sort.field}:${sort.order}`);
    }
  }

  function refresh(e: any) {
    e.preventDefault();

    // search data
    onSearch();
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

    storeContext.askConfirm({
      title: "Are you sure?",
      message: `Would you like to ${trash ? "delete" : "trash"} this item!`,
      label: `Yes, ${trash ? "delete" : "trash"} it!`,
      color: trash ? "danger" : "warning",
      callback: async (isConfirm: boolean) => {
        if (isConfirm) {
          // activate page progress
          storeContext.setPageProgress(true);

          // get url from endpoint
          const endpoint = new URL(`${window.origin}${options.endpoint}`);

          // call api
          const response = await fetch(`${endpoint.origin}${endpoint.pathname}/${e.target.dataset.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
          })

          // get response data
          const data = await response.json();

          setTimeout(() => {
            // deactivate page progress
            storeContext.setPageProgress(false);

            // let response
            let response = {};

            // on error
            if (data.status == "error") {
              // set response
              response = {
                color: "danger",
                message: data.message
              }
            } else {
              // set response
              response = {
                color: data.status,
                message: data.message
              }
            }

            // show message
            storeContext.openToast(response);

            // search data
            onSearch();
          }, 500);
        }
      }
    });
  }

  async function onRestore(e: any) {
    e.preventDefault();

    storeContext.askConfirm({
      title: "Are you sure?",
      message: "Would you like to restore this item!",
      label: "Yes, delete it!",
      color: "success",
      callback: async (isConfirm: boolean) => {
        if (isConfirm) {
          // activate page progress
          storeContext.setPageProgress(true);

          // get url from endpoint
          const endpoint = new URL(`${window.origin}${options.endpoint}`);

          // call api
          const response = await fetch(`${endpoint.origin}${endpoint.pathname}/${e.target.dataset.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ restore: true })
          })

          // get response data
          const data = await response.json();

          setTimeout(() => {
            // deactivate page progress
            storeContext.setPageProgress(false);

            // let response
            let response = {};

            // on error
            if (data.status == "error") {
              // set response
              response = {
                color: "danger",
                message: data.message
              }
            } else {
              // set response
              response = {
                color: data.status,
                message: data.message
              }
            }

            // show message
            storeContext.openToast(response);

            // search data
            onSearch();
          }, 500);
        }
      }
    })
  }

  function onNavigate(e: any) {
    e.preventDefault();

    // get element
    const nav = e.target as HTMLLinkElement;

    // set current page
    setCurrentPage(Number(nav.dataset.page) || 1);
  }

  useEffect(() => {
    // if endpoint
    if ((typeof options.endpoint !== "undefined" && options.endpoint.trim() !== "") || (typeof tab.endpoint !== "undefined" && tab.endpoint.trim() !== "")) {
      // get url from endpoint
      const endpoint = new URL(`${window.origin}${tab.endpoint || options.endpoint}`);

      // extract endpoint
      const url = new URL(`${endpoint.origin}${endpoint.pathname}${typeof tab.endpoint !== "undefined" && tab.endpoint.trim() !== "" ? "" : "/search"}`);

      // loop params
      endpoint.searchParams.forEach((value: string, key: string) => {
        // add page params to search params
        url.searchParams.append(key, value.toString());
      });

      // add page value to search params
      url.searchParams.append("page", currentPage.toString());

      // add page value to search params
      url.searchParams.append("size", options.recordsPerPage.toString());

      // add page value to search params
      url.searchParams.append("trash", trash.toString());

      // let table structure
      const struct: any = [];

      // add search fields
      searchFields.forEach((field: any) => {
        // check field name and value
        if (typeof field.name !== "undefined" && typeof field.value !== "undefined") {
          // get field alias
          const alias = field.alias.trim();

          // add field key value to search params
          url.searchParams.append(`${alias != "" ? `${alias}.` : ""}${field.name}`, field.value);

          // push field info
          struct.push({
            name: `${alias != "" ? `${alias}.` : ""}${field.name}`,
            type: field.type
          });
        }
      });

      // add table struct to search params
      url.searchParams.append("struct", JSON.stringify(struct));

      // add page value to search params
      url.searchParams.append("order_by", orderBy);

      // search data
      searchData(url.toString());
    }
  }, [tab, options.endpoint, currentPage, trash, searchFields, orderBy]);

  useEffect(() => {
    if (typeof router.query.page !== "undefined") {
      // set current page
      setCurrentPage((router.query.page as unknown as number) || 1);
    }
  }, [router.query.page]);

  useEffect(() => {
    if (options.reload === true) {
      // search data
      onSearch();

      // reset search reload status
      if (typeof options.setReload === "function") options.setReload(false);
    }
  }, [options.reload]);

  useEffect(() => {
    // on first load
    if (!loaded && options.searchOnLoad !== false) {
      // search data
      onSearch();

      // set loaded to true
      setLoaded(true);
    }

    // on ready
    if (typeof options.onReady === "function") options.onReady(reload);
  }, []);

  useEffect(() => {
    // on("openButton1:click", (e: any) => { console.log("a") });

    // return () => {
    //   off("openButton:click", (e: any) => { console.log("b") });
    // }

    // get this element
    const thisElement = document.querySelector(`#${options.id}`) as HTMLElement;

    // if element id is defined
    if (thisElement) {
      // attach event to element
      thisElement.dispatchEvent(new Event("reload"));

      thisElement.addEventListener("reload", (e: any) => {
        console.log("sds")
      })
    }
  }, []);

  return (
    <div className="card my-3" id={options.id}>
      <div className={`card-head border-bottom px-3 d-flex justify-content-${options.tabs !== false ? "between" : "end"}`} style={{ minHeight: "48px" }}>
        {options.tabs !== false ?
          <ul className="nav nav-underline">
            {typeof options.tabs !== "undefined" && options.tabs.length ?
              options.tabs.map((tab: any, i: number) => (
                <li key={i} className="nav-item">
                  <a className={`nav-link ${i == 0 ? "active" : ""}`} data-endpoint={tab.endpoint} data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="records" aria-selected={i == 0 ? true : false}>{tab.label}</a>
                </li>
              )) : <>
                <li className="nav-item">
                  <a className="nav-link active" data-id="records" data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="records" aria-selected={true}>Records</a>
                </li>
                {options.permissions?.Delete ?
                  <li className="nav-item">
                    <a className="nav-link" data-id="trash" data-bs-toggle="tab" onClick={toogleTab} type="button" role="tab" aria-controls="trash" aria-selected={false}>Trash</a>
                  </li>
                  : ""}
              </>
            }
          </ul> : ""}
        <div className="align-content-center">{options.controls}</div>
      </div>
      <div className="card-body p-0">
        <SimpleBar className={"table-responsive" + (totalRecords == 0 ? " no-record-found" : "")} autoHide={true} style={options.style ?? { height: "calc(100vh - 191px)" }}>
          <div className="flex-table">
            {options.searchable == true || options.searchable == undefined ?
              <>
                <div className="flex-table-header">
                  <div className="flex-table-row">
                    {options.selections !== false ?
                      <div className="flex-table-col" style={{ width: "72px" }}>
                        <div className="d-flex align-items-center">
                          <Link href="#" className="d-flex me-2">
                            <i className="material-symbols-rounded text-body-emphasis icon-check">arrow_back</i>
                          </Link>
                          <Link href="#" className="d-flex" onClick={refresh}>
                            <i className="material-symbols-rounded text-body-emphasis icon-check">refresh</i>
                          </Link>
                        </div>
                      </div>
                      : ""}
                    {options.columns.map((item: any, id: number) => (
                      <div key={id} data-field={item.key} data-order="" data-alias={item.alias ?? ""} className={"flex-table-col sorting" + (totalRecords > 0 ? "" : " disable")} onClick={handleSorting} style={{ width: item.width ?? "auto" }}>{item.value}</div>
                    ))}
                    {options.actions !== false ?
                      <div className="flex-table-col"></div>
                      : ""}
                  </div>
                </div>
                {options.header !== false ?
                  <div className="flex-table-header">
                    {options.selections !== false ?
                      <div className="flex-table-col">
                        <div className="d-flex align-items-center">
                          <div className="form-check mb-0 me-2">
                            <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                          </div>
                          <Link className="d-flex" href="#"
                            data-bs-toggle="dropdown"
                            data-bs-placement="right"
                            title=""
                            data-bs-original-title="Home">
                            <i className="material-symbols-rounded icon-check material-symbols-rounded text-body-emphasis cursor-pointer">more_vert</i>
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="defaultDropdown">
                            {options.permissions?.Delete ?
                              <li>
                                <Link href="#" className="dropdown-item d-flex align-items-center">
                                  Move to Trash
                                </Link>
                              </li>
                              : ""}
                            <li>
                              <Link href="#" className="dropdown-item d-flex align-items-center">
                                Add to Favourite
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      : ""}
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
                  : ""}
              </>
              :
              options.header !== false ?
                <div className="flex-table-header">
                  {options.selections !== false ?
                    <div className="flex-table-col" style={{ width: "72px" }}>
                      <div className="d-flex align-items-center">
                        <div className="form-check mb-0 me-2">
                          <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                        </div>
                        <Link className="d-flex" href="#"
                          data-bs-toggle="dropdown"
                          data-bs-placement="right"
                          title=""
                          data-bs-original-title="Home">
                          <i className="material-symbols-rounded icon-check material-symbols-rounded text-body-emphasis cursor-pointer">more_vert</i>
                        </Link>
                        <ul className="dropdown-menu dropdown-menu-start" aria-labelledby="defaultDropdown">
                          {options.permissions?.Delete ?
                            <li>
                              <Link href="#" className="dropdown-item d-flex align-items-center">
                                Move to Trash
                              </Link>
                            </li>
                            : ""}
                          <li className="border-top my-1"></li>
                          <li>
                            <Link href="#" className="dropdown-item d-flex align-items-center">
                              Add to Favourite
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    : ""}
                  {options.columns.map((item: any, id: number) => (
                    <div key={id} data-field={item.key} data-order="" data-alias={item.alias ?? ""} className={"flex-table-col" + (totalRecords > 0 ? " " : " disable")} onClick={handleSorting} style={{ width: item.width ?? "auto" }}>{item.value}</div>
                  ))}
                  {options.actions !== false ?
                    <div className="flex-table-col text-center" style={{ width: options.actionWidth ?? "85px" }}>
                      Action
                    </div>
                    : ""}
                </div>
                : ""
            }
            <div className={`flex-table-body ${options.searchable == true || options.searchable == undefined ? "" : "no-padding"}`} style={{ overflow: "auto" }}>
              {data.map((row: any, id: number) => (
                <div key={id} className="flex-table-row">
                  {options.selections !== false ?
                    <div className="flex-table-col">
                      <div className="d-flex align-items-center">
                        <div className="form-check mb-0 me-2">
                          <input className="form-check-input" type="checkbox" value="qw" id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault"></label>
                        </div>
                        {/* <i className="material-symbols-filled text-danger icon-check">favorite</i> */}
                        <i className="material-symbols-rounded icon-check">favorite</i>
                      </div>
                    </div>
                    : ""}
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
                    <div className="flex-table-col" style={{ width: options.actionWidth ?? "85px" }}>
                      <div className="d-flex align-items-center justify-content-evenly">
                        {trash ?
                          options.permissions?.Delete ?
                            <Link href="#" onClick={onRestore} data-id={row.id} className="d-flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Restore">
                              <i className="material-symbols-rounded text-success icon-check pe-none">history</i>
                            </Link>
                            : ""
                          : typeof options.onEdit === "function" ?
                            options.permissions?.Update ?
                              <Link href="#" onClick={onEdit} data-id={row.id} className="d-flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                <i className="material-symbols-rounded text-body-emphasis icon-check pe-none">edit_note</i>
                              </Link> : ""
                            : ""
                        }

                        {typeof options.actions !== "undefined" ? options.actions.map((action: any, i: number) => (
                          <Link key={i} href="#" onClick={action.onClick} data-id={row.id} className="d-flex mx-1" data-tab-endpoint={tab.endpoint || options.endpoint} data-bs-toggle="tooltip" data-bs-placement="top" title={action.title}>
                            <i className={`material-symbols-rounded ${typeof action.color !== "undefined" ? action.color : "text-body-emphasis"} icon-check pe-none`}>{action.icon}</i>
                          </Link>
                        )) : ""}

                        {options.permissions?.Delete ?
                          <Link href="#" onClick={onDelete} data-id={row.id} className="d-flex mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title={trash ? "Delete" : "Trash"}>
                            <i className={`material-symbols-rounded ${trash ? "text-danger" : "text-warning"} icon-check pe-none`}>{trash ? "delete_forever" : "delete"}</i>
                          </Link>
                          : ""}
                      </div>
                    </div>
                    : ""}
                </div>
              ))}
            </div>
          </div>
        </SimpleBar>
      </div>
      {options.navigation !== false ?
        <div className="card-footer d-flex align-items-center justify-content-between p-3 border-top flex-sm-row flex-column">
          <span className="h6 m-sm-0 text-muted">
            {totalRecords > 0 ?
              `Showing ${currentPage * options.recordsPerPage - (options.recordsPerPage - 1)} to ${options.recordsPerPage * currentPage > totalRecords
                ? totalRecords
                : options.recordsPerPage * currentPage} of ${totalRecords} records`
              : "No record found"}
          </span>
          {totalRecords > 0 ?
            <nav aria-label="Search Paginatiom">
              <ul className="pagination">
                <li className={"page-item" + (currentPage == 1 ? " disabled" : "")}>
                  <Link className="page-link" href="#" onClick={onNavigate} data-page={currentPage - 1}>Prev</Link>
                </li>
                {
                  pageNavs.map((p: any, i: number) => (
                    <li key={i} className={currentPage == p ? "page-item active" : "page-item"}>
                      {p == "..." ?
                        <Link className="page-link text-muted" href="#" onClick={(e: any) => { e.preventDefault() }}>{p}</Link>
                        :
                        <Link className="page-link" href="#" onClick={onNavigate} data-page={p}>{p}</Link>
                      }
                    </li>
                  ))
                }
                <li className={"page-item" + (currentPage == pageCount ? " disabled" : "")}>
                  <Link className="page-link" href="#" onClick={onNavigate} data-page={currentPage + 1}>Next</Link>
                </li>
              </ul>
            </nav>
            : ""}
        </div>
        : ""}
    </div>
  )
}