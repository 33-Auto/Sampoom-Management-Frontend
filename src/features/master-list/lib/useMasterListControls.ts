import { useEffect, useMemo, useState } from "react";import { usePaginationTable } from "@/features/table-pagination";export interface MasterListFilterConfig {
  key: string;
  initialValue?: string;
}

interface FiltersRecord {
  [key: string]: string;
}

const cloneFilters = (filters: FiltersRecord) => ({
  ...filters,
});

export const useMasterListControls = (
  filterConfigs: MasterListFilterConfig[] = [],
) => {
  const filterConfigsSignature = useMemo(
    () => JSON.stringify(filterConfigs),
    [filterConfigs],
  );

  const stableFilterConfigs = useMemo(
    () => filterConfigs,
    [filterConfigsSignature],
  );

  const baseFilters = useMemo(() => {
    return stableFilterConfigs.reduce<FiltersRecord>((acc, config) => {
      acc[config.key] = config.initialValue ?? "";
      return acc;
    }, {});
  }, [stableFilterConfigs]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltersRecord>(() =>
    cloneFilters(baseFilters),
  );

  useEffect(() => {
    setFilters(cloneFilters(baseFilters));
  }, [baseFilters]);

  const pagination = usePaginationTable({});

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    pagination.onPageChange(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      if (prev[key] === value) {
        return prev;
      }
      return {
        ...prev,
        [key]: value,
      };
    });
    pagination.onPageChange(0);
  };

  const resetFilters = () => {
    setFilters(cloneFilters(baseFilters));
    pagination.onPageChange(0);
  };

  const resetAll = () => {
    setSearchTerm("");
    resetFilters();
  };

  const getFilterValue = (key: string) => filters[key] ?? "";

  return {
    searchTerm,
    setSearchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    getFilterValue,
    resetFilters,
    resetAll,
    pagination,
  };
};
