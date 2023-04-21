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

const dataListCap = 100;

interface IndexTableProps {
  heading: string;
  initData?: ListResult<any>;
  columns: ColumnDef<any>[];
}

function IndexTable({ heading, initData, columns }: IndexTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableId = `${initData?.items.length}-${initData?.items.at(0)?.id}`;

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
    sortDescFirst: true,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = table.getPrePaginationRowModel().rows.length;
  const counter = `${pageIndex * pageSize} - ${Math.min(
    totalItems,
    (pageIndex + 1) * pageSize
  )} of ${totalItems}`;

  const fillerRows = pageSize - table.getRowModel().rows.length;

  return (
    <section>
      <header className="flex items-center pb-4">
        <h2 className="grow text-xl font-semibold text-gray-700">{heading}</h2>
        <DebouncedInput
          initialValue={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="input-bordered input placeholder:font-normal placeholder:text-gray-400"
          placeholder="Search all columns..."
          wait={200}
        />
      </header>
      <div className="overflow-x-auto p-1">
        <table className="min-w-full">
          <thead className="border-b text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const showFilter = header.column.getCanFilter();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="h-full"
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex h-full flex-col gap-1 pb-2">
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "flex cursor-pointer group hover:bg-gray-50 items-center"
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
                            }[header.column.getIsSorted() as string] ?? (
                              <IcRoundArrowDownward className="invisible text-gray-400 group-hover:visible"></IcRoundArrowDownward>
                            )}
                          </div>
                          <div className="flex">
                            {showFilter ? (
                              <Filter
                                column={header.column}
                                table={table}
                                tableId={tableId}
                                wait={200}
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
                  className="h-11 odd:bg-white even:bg-slate-100 hover:bg-slate-200"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="h-full">
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
                  height: `calc(2.75rem * ${fillerRows})`,
                }}
              >
                <td colSpan={columns.length}></td>
              </tr>
            )}
          </tbody>
          <tfoot className="border-t text-left">
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="h-11">
                {footerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="h-full"
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
        <label className="label" htmlFor={`perPage-${tableId}`}>
          Rows per page:
        </label>
        <select
          id={`perPage-${tableId}`}
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
  tableId,
  wait,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
  tableId?: string;
  wait?: number;
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
        initialValue={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
        }`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        wait={wait}
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        initialValue={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
        }`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        wait={wait}
      />
    </>
  ) : (
    <>
      <datalist id={`${column.id}-${tableId}-list`}>
        {sortedUniqueValues.slice(0, dataListCap).map((value: any) => (
          <option className="bg-blue-500 p-5" value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        initialValue={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="input-bordered input input-sm mr-2 w-full placeholder:font-normal placeholder:text-gray-400"
        list={`${column.id}-${tableId}-list`}
        wait={wait}
      />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  initialValue,
  onChange,
  wait = 500,
  ...props
}: {
  initialValue: string | number;
  onChange: (value: string | number) => void;
  wait?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, wait);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default IndexTable;
