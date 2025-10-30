import React from "react";

import { Input, Select } from "@/shared/ui";

interface SelectOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
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
  filters = [],
  actions,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="w-full">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="w-full">
            <Select
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              disabled={filter.disabled}
            />
          </div>
        ))}

        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    </div>
  );
};
