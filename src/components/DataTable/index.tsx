import Link from "next/link";
import { JSX } from "react";
import CheckRadio from "@/components/CheckRadio";
import { count } from "console";

// define column type
type ColumnType = {
  field: string;
  label: string;
  alias?: string | undefined;
  type?: "text" | "select" | "date";
  width?: number | string | undefined;
  defaultValue?: string | undefined;
  render?: (row: any) => JSX.Element;
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
  isSearchable?: boolean | undefined;
  orderBy?: string | undefined;
  recordsPerPage?: number | undefined;
  actions?: ActionType[] | undefined;
};

export default function DataTable({ columns, endpoint, isSearchable = true, orderBy = "", recordsPerPage = 10, actions }: DataTableProps) {
  return (
    <>
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700">
          <tr>
            <th className="w-[20px] px-4 py-2.5">
              <CheckRadio type="checkbox" id={"abc"} />
            </th>
            {columns.map((column, index) =>
              <th key={index} className="text-left p-2.5" style={{ width: column.width ?? "auto" }}>
                {isSearchable ?
                  <div className="bg-white dark:bg-gray-600 outline-1 outline-black/10 dark:outline-white/10 focus-within:outline-primary-600 dark:focus-within:outline-primary-600 rounded-sm">
                    <input type="text" name={column.field} className="outline-none py-1 px-2 w-full text-sm font-light" placeholder={column.label} defaultValue="" />
                  </div>
                  : column.label}
              </th>
            )}
            {actions && (
              <th className="w-[100px] p-2.5">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3].map(item =>
            <tr key={item} className="border-b border-black/10 dark:border-white/10">
              <td className="text-left px-4 py-2.5">
                <CheckRadio type="checkbox" id={"customCheckcolor1-" + item} />
              </td>
              {columns.map((column, index) =>
                <>
                  {typeof column.render === "function" ?
                    <td key={index} className="text-left p-2.5">{column.render(item)}</td>
                    :
                    <td key={index} className="text-left p-2.5">Webclient</td>
                  }
                </>
              )}
              {actions && (
                <td className="text-left p-2.5">
                  <div className="flex items-center justify-center gap-3">
                    {actions.map((action, index) =>
                      <button className="cursor-pointer" key={index} title={action.label} onClick={(e) => action.onClick(e, item)}>{action.icon}</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table >
    </>
  );
}
