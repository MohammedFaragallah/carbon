import { Button, HStack } from "@carbon/react";
import type { Column, ColumnOrderState } from "@tanstack/react-table";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdOutlineEditNote } from "react-icons/md";
import New from "~/components/New";
import { DebouncedInput } from "~/components/Search";
import { useUrlParams } from "~/hooks";
import type { TableAction } from "../types";
import Actions from "./Actions";
import Columns from "./Columns";
import { ActiveFilters, Filter } from "./Filter";
import type { ColumnFilter } from "./Filter/types";
import type { PaginationProps } from "./Pagination";
import { PaginationButtons } from "./Pagination";
import Sort from "./Sort";

type HeaderProps<T> = {
  actions: TableAction<T>[];
  columnAccessors: Record<string, string>;
  columnOrder: ColumnOrderState;
  columns: Column<T, unknown>[];
  editMode: boolean;
  filters: ColumnFilter[];
  label?: string;
  newPath?: string;
  newPermission?: boolean;
  pagination: PaginationProps;
  selectedRows: T[];
  setColumnOrder: (newOrder: ColumnOrderState) => void;
  setEditMode: (editMode: boolean) => void;
  withColumnOrdering: boolean;
  withInlineEditing: boolean;
  withPagination: boolean;
  withSelectableRows: boolean;
};

const TableHeader = <T extends object>({
  actions,
  columnAccessors,
  columnOrder,
  columns,
  editMode,
  filters,
  label,
  newPath,
  newPermission,
  pagination,
  selectedRows,
  setColumnOrder,
  setEditMode,
  withColumnOrdering,
  withInlineEditing,
  withPagination,
  withSelectableRows,
}: HeaderProps<T>) => {
  const [params] = useUrlParams();
  const currentFilters = params.getAll("filter");

  return (
    <>
      <HStack className="px-2 py-1.5 justify-between bg-background border-b border-border w-full">
        <HStack>
          <DebouncedInput param="search" size="sm" placeholder="Search" />
          {!!filters?.length && <Filter filters={filters} />}
        </HStack>
        <HStack>
          {withSelectableRows && actions.length > 0 && (
            // TODO: move this to a draggable bar like Linear
            <Actions actions={actions} selectedRows={selectedRows} />
          )}
          {withInlineEditing &&
            (editMode ? (
              <Button
                leftIcon={<BsFillCheckCircleFill />}
                onClick={() => setEditMode(false)}
              >
                Finish Editing
              </Button>
            ) : (
              <Button
                leftIcon={<MdOutlineEditNote />}
                variant="ghost"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            ))}
          <Sort columnAccessors={columnAccessors} />
          {withColumnOrdering && (
            <Columns
              columnOrder={columnOrder}
              columns={columns}
              setColumnOrder={setColumnOrder}
              withSelectableRows={withSelectableRows}
            />
          )}
          {withPagination &&
            (pagination.canNextPage || pagination.canPreviousPage) && (
              <PaginationButtons {...pagination} condensed />
            )}
          {!!newPath && !!newPermission && <New to={newPath} label={label} />}
        </HStack>
      </HStack>
      {currentFilters.length > 0 && (
        <HStack className="flex-wrap px-2 py-1.5 justify-between bg-background border-b border-border w-full">
          <HStack className="flex-wrap">
            <ActiveFilters filters={filters} />
          </HStack>
        </HStack>
      )}
    </>
  );
};

export default TableHeader;
