import type { MasterListFilter } from "@/features/master-list";
import { Badge } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildPositionCategoryOptions,
  formatCurrency,
  formatHeadcount,
  getPositionCategoryVariant,
  getPositionStatusVariant,
} from "../lib/formatters";

export interface PositionRecord {
  positionCode: string;
  positionName: string;
  level: number;
  category: string;
  baseSalary: number;
  allowance: number;
  description: string;
  employeeCount: number;
  status: string;
  createdDate: string;
}

export const createPositionFilters = ({
  categoryValue,
  onCategoryChange,
}: {
  categoryValue: string;
  onCategoryChange: (value: string) => void;
}): MasterListFilter[] => [
  {
    key: "category",
    value: categoryValue,
    options: buildPositionCategoryOptions(),
    onChange: onCategoryChange,
  },
];

export const positionColumns: Column[] = [
  { key: "positionCode", title: "직급 코드", width: "120px" },
  { key: "positionName", title: "직급명", width: "120px" },
  {
    key: "level",
    title: "레벨",
    width: "80px",
    render: (value: number) => (
      <Badge variant="info" className="justify-center">
        {value}
      </Badge>
    ),
  },
  {
    key: "category",
    title: "구분",
    width: "100px",
    render: (value: string) => (
      <Badge variant={getPositionCategoryVariant(value)}>{value}</Badge>
    ),
  },
  {
    key: "baseSalary",
    title: "기본급",
    width: "120px",
    render: (value: number) => formatCurrency(value),
  },
  {
    key: "allowance",
    title: "수당",
    width: "120px",
    render: (value: number) => formatCurrency(value),
  },
  {
    key: "employeeCount",
    title: "인원수",
    width: "80px",
    render: (value: number) => formatHeadcount(value),
  },
  { key: "description", title: "설명" },
  {
    key: "status",
    title: "상태",
    width: "80px",
    render: (value: string) => (
      <Badge variant={getPositionStatusVariant(value)}>{value}</Badge>
    ),
  },
];
