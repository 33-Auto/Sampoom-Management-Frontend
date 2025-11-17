import type { MasterListFilter } from "@/features/master-list";
import { Badge, Button } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildRoutingStatusOptions,
  formatRoutingCategoryPath,
  formatRoutingMinutes,
  formatRoutingStatus,
  formatRoutingStepCount,
  getRoutingStatusVariant,
} from "../lib/formatters";
import type { ProcessResponseDTO, RoutingStatus } from "../model";

interface RoutingColumnsParams {
  keys: Record<keyof ProcessResponseDTO, keyof ProcessResponseDTO>;
  onInspect: (row: ProcessResponseDTO) => void;
  onEdit: (row: ProcessResponseDTO) => void;
}

interface RoutingFiltersParams {
  categoryValue: string;
  groupValue: string;
  statusValue: string;
  categoryOptions: { value: string; label: string }[];
  groupOptions: { value: string; label: string }[];
  onCategoryChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const createRoutingFilters = ({
  categoryValue,
  groupValue,
  statusValue,
  categoryOptions,
  groupOptions,
  onCategoryChange,
  onGroupChange,
  onStatusChange,
}: RoutingFiltersParams): MasterListFilter[] => [
  {
    key: "category",
    value: categoryValue,
    options: categoryOptions,
    onChange: onCategoryChange,
  },
  {
    key: "group",
    value: groupValue,
    options: groupOptions,
    onChange: onGroupChange,
  },
  {
    key: "status",
    value: statusValue,
    options: buildRoutingStatusOptions(),
    onChange: onStatusChange,
  },
];

export const createRoutingColumns = ({
  keys,
  onInspect,
  onEdit,
}: RoutingColumnsParams): Column[] => [
  { key: keys.code, title: "공정 코드", width: "120px" },
  { key: keys.partCode, title: "품목 코드", width: "120px" },
  { key: keys.partName, title: "품목명" },
  {
    key: keys.categoryName,
    title: "카테고리",
    width: "160px",
    render: (_value: string, row: ProcessResponseDTO) =>
      formatRoutingCategoryPath(row.categoryName, row.groupName),
  },
  { key: keys.version, title: "버전", width: "80px" },
  {
    key: keys.totalStepMinutes,
    title: "총 리드타임",
    width: "120px",
    render: (value: number) => formatRoutingMinutes(value),
  },
  {
    key: keys.stepCount,
    title: "공정 수",
    width: "80px",
    render: (value: number) => formatRoutingStepCount(value),
  },
  {
    key: keys.status,
    title: "상태",
    width: "80px",
    render: (value: string) => {
      const typedValue = value as RoutingStatus | null | undefined;
      return (
        <Badge variant={getRoutingStatusVariant(typedValue)}>
          {formatRoutingStatus(typedValue)}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    title: "작업",
    width: "150px",
    render: (_value: any, row: ProcessResponseDTO) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => onInspect(row)}>
          <i className="ri-eye-line mr-1"></i>
          상세
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
          <i className="ri-edit-line mr-1"></i>
          편집
        </Button>
      </div>
    ),
  },
];
