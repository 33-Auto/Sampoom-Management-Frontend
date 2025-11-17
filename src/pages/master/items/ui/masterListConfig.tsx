import type { MasterListFilter } from "@/features/master-list";
import { Badge, Button } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildItemTypeFilterOptions,
  formatItemCategoryPath,
  formatItemLeadTime,
  formatItemStandardCost,
  formatItemTypeLabel,
  getItemTypeBadgeVariant,
} from "../lib/formatters";
import type { ItemResponseDTO } from "../model";

interface ItemColumnsParams {
  onEdit: (item: ItemResponseDTO) => void;
}

interface ItemFiltersParams {
  selectedType: "전체" | "원자재" | "부품";
  categoryValue: string;
  groupValue: string;
  materialCategoryOptions: { value: string; label: string }[];
  partCategoryOptions: { value: string; label: string }[];
  partGroupOptions: { value: string; label: string }[];
  onTypeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onGroupChange: (value: string) => void;
}

export const createItemFilters = ({
  selectedType,
  categoryValue,
  groupValue,
  materialCategoryOptions,
  partCategoryOptions,
  partGroupOptions,
  onTypeChange,
  onCategoryChange,
  onGroupChange,
}: ItemFiltersParams): MasterListFilter[] => {
  const categoryOptions =
    selectedType === "원자재"
      ? materialCategoryOptions
      : selectedType === "부품"
        ? partCategoryOptions
        : [{ value: "", label: "전체 카테고리" }];

  const isCategoryDisabled = selectedType === "전체";
  const isGroupDisabled = selectedType !== "부품" || categoryValue === "";

  return [
    {
      key: "type",
      value: selectedType,
      options: buildItemTypeFilterOptions(),
      onChange: onTypeChange,
    },
    {
      key: "category",
      value: categoryValue,
      options: categoryOptions,
      onChange: onCategoryChange,
      disabled: isCategoryDisabled,
    },
    {
      key: "group",
      value: groupValue,
      options: partGroupOptions,
      onChange: onGroupChange,
      disabled: isGroupDisabled,
    },
  ];
};

export const createItemColumns = ({ onEdit }: ItemColumnsParams): Column[] => [
  { key: "code", title: "품목 코드", width: "120px" },
  { key: "name", title: "품목명" },
  {
    key: "categoryName",
    title: "카테고리",
    width: "200px",
    render: (_value: string, row: ItemResponseDTO) =>
      formatItemCategoryPath(row),
  },
  {
    key: "type",
    title: "품목 유형",
    width: "100px",
    render: (value: string) => (
      <Badge variant={getItemTypeBadgeVariant(value)}>
        {formatItemTypeLabel(value)}
      </Badge>
    ),
  },
  {
    key: "baseQuantity",
    title: "기준 수량",
    width: "100px",
    render: (value: number) => value || 0,
  },
  { key: "unit", title: "단위", width: "80px" },
  {
    key: "standardCost",
    title: "표준 단가",
    width: "120px",
    render: (value: number | undefined) => formatItemStandardCost(value),
  },
  {
    key: "leadTime",
    title: "리드 타임",
    width: "100px",
    render: (value: number) => formatItemLeadTime(value),
  },
  {
    key: "actions",
    title: "작업",
    width: "120px",
    render: (_value: any, row: ItemResponseDTO) => (
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          aria-label="품목 편집"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
        >
          <i className="ri-edit-line" />
        </Button>
      </div>
    ),
  },
];
