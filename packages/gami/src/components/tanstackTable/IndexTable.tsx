"use client";

import { useQueryClient } from "@tanstack/react-query";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Table,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ListResult } from "pocketbase";
import type { InputHTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";

import { rankItem } from "@tanstack/match-sorter-utils";
import { IcRoundArrowDownward } from "../icons/IcRoundArrowDownward";
import { IcRoundArrowUpward } from "../icons/IcRoundArrowUpward";
import Pagination from "./Paginataion";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface IndexTableProps {
  initData?: ListResult<any>;
  columns: ColumnDef<any>[];
}

function IndexTable({ initData, columns }: IndexTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();
  useEffect(() => {
    setInterval(
      () =>
        queryClient.invalidateQueries({ queryKey: ["coursesCustomResponse"] }),
      15 * 1000
    );
  }, [queryClient]);

  const table = useReactTable<any>({
    data: initData?.items ?? [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = initData?.totalItems ?? 0;
  const counter = `${pageIndex * pageSize} - ${Math.min(
    totalItems,
    (pageIndex + 1) * pageSize
  )} of ${totalItems}`;
  const fillerRows =
    table.getState().pagination.pageSize - table.getRowModel().rows.length;

  return (
    <section>
      <header className="flex items-center pb-5">
        <h2 className="grow text-xl font-semibold text-gray-700">
          My lecture courses
        </h2>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="input-bordered input placeholder:font-normal placeholder:text-gray-400"
          placeholder="Search all columns..."
          debounce={200}
        />
      </header>
      <div className="overflow-x-auto p-1">
        <table>
          <thead className="border-b text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const showFilter =
                    header.column.getCanFilter() &&
                    header.column.id != "chevron_right";

                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className="grid grid-cols-[min-content] pb-2">
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "flex cursor-pointer hover:bg-gray-50 px-2 py-1 items-center"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <h4 className="flex-grow">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </h4>
                            {{
                              asc: <IcRoundArrowUpward></IcRoundArrowUpward>,
                              desc: (
                                <IcRoundArrowDownward></IcRoundArrowDownward>
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          <div className="flex">
                            {showFilter ? (
                              <Filter
                                column={header.column}
                                table={table}
                                debounce={200}
                              />
                            ) : null}
                          </div>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="odd:bg-white even:bg-slate-100 hover:bg-slate-200"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {fillerRows > 0 && (
              <tr
                style={{
                  height: `calc(calc(2.5rem + 0.5px) * ${fillerRows})`,
                }}
              >
                <td colSpan={columns.length}></td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t text-left">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="p-2"
                      colSpan={header.colSpan}
                    >
                      {flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
      <footer className="item flex items-center justify-end gap-1">
        <label className="label" htmlFor="perPage">
          Rows per page:
        </label>
        <select
          id="perPage"
          className="select-bordered select select-sm"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <p className="mx-6">{counter}</p>
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          pageRange={table.getPageCount()}
          setPage={table.setPageIndex}
        ></Pagination>
      </footer>
    </section>
  );
}

function Filter({
  column,
  table,
  debounce,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
  debounce?: number;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
  );

  return typeof firstValue === "number" ? (
    <>
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
        }`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        debounce={debounce}
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
        }`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        debounce={debounce}
      />
    </>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        list={column.id + "list"}
        debounce={debounce}
      />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default IndexTable;
