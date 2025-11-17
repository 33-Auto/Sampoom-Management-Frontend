import type { MasterListFilter } from "@/features/master-list";
import { Badge, Button } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildBranchStatusOptions,
  buildBranchTypeOptions,
  formatBranchStatus,
  formatBranchType,
  getBranchStatusVariant,
  getBranchTypeBadgeVariant,
} from "../lib/formatters";
import type { BranchResponseDTO, BranchStatus, BranchType } from "../model";

interface BranchColumnsParams {
  keys: Record<keyof BranchResponseDTO, keyof BranchResponseDTO>;
  onEdit: (row: BranchResponseDTO) => void;
}

interface BranchFiltersParams {
  typeValue: string;
  statusValue: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const createBranchFilters = ({
  typeValue,
  statusValue,
  onTypeChange,
  onStatusChange,
}: BranchFiltersParams): MasterListFilter[] => [
  {
    key: "type",
    value: typeValue,
    options: buildBranchTypeOptions(),
    onChange: onTypeChange,
  },
  {
    key: "status",
    value: statusValue,
    options: buildBranchStatusOptions(),
    onChange: onStatusChange,
  },
];

export const createBranchColumns = ({
  keys,
  onEdit,
}: BranchColumnsParams): Column[] => [
  { key: keys.branchCode, title: "지점 코드", width: "120px" },
  { key: keys.name, title: "지점명" },
  {
    key: keys.type,
    title: "유형",
    width: "120px",
    render: (value: string) => {
      const typedValue = value as BranchType | null | undefined;
      return (
        <Badge variant={getBranchTypeBadgeVariant(typedValue)}>
          {formatBranchType(typedValue)}
        </Badge>
      );
    },
  },
  { key: keys.address, title: "주소" },
  {
    key: keys.status,
    title: "상태",
    width: "80px",
    render: (value: string) => {
      const typedValue = value as BranchStatus | null | undefined;
      return (
        <Badge variant={getBranchStatusVariant(typedValue)}>
          {formatBranchStatus(typedValue)}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    title: "작업",
    width: "120px",
    render: (_value: any, row: BranchResponseDTO) => (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onEdit(row)}
        aria-label="지점 편집"
      >
        <i className="ri-edit-line mr-1"></i>
        편집
      </Button>
    ),
  },
];
