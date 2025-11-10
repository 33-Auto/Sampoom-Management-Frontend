import React from "react";

import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  filters?: Array<{
    key: string;
    label?: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    disabled?: boolean;
  }>;
  actions?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "검색...",
  searchLabel,
  filters = [],
  actions,
}) => {
  const showSearch = searchTerm !== undefined && onSearchChange !== undefined;

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-bg-card-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <div
        className={`grid grid-cols-1 gap-4 ${
          showSearch
            ? "md:grid-cols-5"
            : `md:grid-cols-${Math.min(filters.length + (actions ? 1 : 0), 4)}`
        }`}
      >
        {showSearch && (
          <div className="w-full">
            <Input
              label={searchLabel}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}

        {filters.map((filter) => (
          <div key={filter.key} className="w-full">
            <Select
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              disabled={filter.disabled}
              className="cursor-pointer"
            />
          </div>
        ))}

        {actions && <div className="flex items-end space-x-2">{actions}</div>}
      </div>
    </div>
  );
};
