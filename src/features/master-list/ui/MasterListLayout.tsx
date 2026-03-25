import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { PaginationTableSection, SearchFilterBar, Table } from "@/shared/ui";
import type { TableProps } from "@/shared/ui";

interface MasterListFilterOption {
  value: string;
  label: string;
}

export interface MasterListFilter {
  key: string;
  label?: string;
  value: string;
  options: MasterListFilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface MasterListLayoutProps {
  title: ReactNode;
  containerClassName?: string;
  headerSlot?: ReactNode;
  asideSlot?: ReactNode;
  search?: {
    term: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
  };
  filters?: MasterListFilter[];
  actions?: ReactNode;
  table: TableProps;
  pagination: {
    totalElements: number;
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (
      page: number | ((prev: number) => number),
    ) => void | Promise<void>;
    onSizeChange: (size: number) => void;
    showRefresh?: boolean;
    onRefresh?: () => void | Promise<unknown>;
    actionsRight?: ReactNode;
  };
}

export const MasterListLayout = ({
  title,
  containerClassName,
  headerSlot,
  asideSlot,
  search,
  filters,
  actions,
  table,
  pagination,
}: MasterListLayoutProps) => {
  const shouldRenderFilters =
    search !== undefined || (filters && filters.length > 0) || Boolean(actions);

  return (
    <div className={cn("mx-auto max-w-7xl px-6 py-8", containerClassName)}>
      {headerSlot && <div className="mb-6">{headerSlot}</div>}

      {shouldRenderFilters && (
        <SearchFilterBar
          searchTerm={search?.term}
          onSearchChange={search?.onChange}
          searchPlaceholder={search?.placeholder}
          searchLabel={search?.label}
          filters={filters}
          actions={actions}
        />
      )}
      {asideSlot ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <PaginationTableSection
              title={title}
              totalElements={pagination.totalElements}
              page={pagination.page}
              totalPages={pagination.totalPages}
              size={pagination.size}
              onPageChange={pagination.onPageChange}
              onSizeChange={pagination.onSizeChange}
              showRefresh={pagination.showRefresh}
              onRefresh={pagination.onRefresh}
              actionsRight={pagination.actionsRight}
            >
              <Table {...table} />
            </PaginationTableSection>
          </div>
          <div>{asideSlot}</div>
        </div>
      ) : (
        <PaginationTableSection
          title={title}
          totalElements={pagination.totalElements}
          page={pagination.page}
          totalPages={pagination.totalPages}
          size={pagination.size}
          onPageChange={pagination.onPageChange}
          onSizeChange={pagination.onSizeChange}
          showRefresh={pagination.showRefresh}
          onRefresh={pagination.onRefresh}
          actionsRight={pagination.actionsRight}
        >
          <Table {...table} />
        </PaginationTableSection>
      )}
    </div>
  );
};
