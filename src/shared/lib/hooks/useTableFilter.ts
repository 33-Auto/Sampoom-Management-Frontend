import { useState, useMemo } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  state: string;
  setState: (value: string) => void;
  options: FilterOption[];
  matchFn?: (item: any, value: string) => boolean;
}

interface UseTableFilterProps<T> {
  data: T[];
  searchFields?: Array<keyof T | ((item: T) => string)>;
  filters?: FilterConfig[];
}

export function useTableFilter<T extends Record<string, any>>({
  data,
  searchFields = [],
  filters = [],
}: UseTableFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 검색어 필터링
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchFields.some((field) => {
          if (typeof field === "function") {
            return field(item)?.toLowerCase().includes(searchLower);
          }
          const value = item[field];
          return value?.toString().toLowerCase().includes(searchLower);
        });

        if (!matchesSearch) return false;
      }

      // 추가 필터링
      return filters.every((filter) => {
        if (filter.state === "전체") return true;

        if (filter.matchFn) {
          return filter.matchFn(item, filter.state);
        }

        // 기본 매칭: 필터 키와 상태가 일치하는지 확인
        const itemValue = item[filter.key];
        return itemValue === filter.state;
      });
    });
  }, [data, searchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
}
