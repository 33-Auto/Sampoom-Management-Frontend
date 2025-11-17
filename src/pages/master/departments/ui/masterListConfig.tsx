import type { MasterListFilter } from "@/features/master-list";
import { Badge } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildDepartmentStatusOptions,
  formatDepartmentBudget,
  formatDepartmentHeadcount,
  getDepartmentStatusVariant,
} from "../lib/formatters";

interface DepartmentRecord {
  deptCode: string;
  deptName: string;
  parentDept: string;
  manager: string;
  employeeCount: number;
  budget: number;
  status: string;
  createdDate: string;
}

export const createDepartmentFilters = ({
  statusValue,
  onStatusChange,
}: {
  statusValue: string;
  onStatusChange: (value: string) => void;
}): MasterListFilter[] => [
  {
    key: "status",
    value: statusValue,
    options: buildDepartmentStatusOptions(),
    onChange: onStatusChange,
  },
];

export const departmentColumns: Column[] = [
  { key: "deptCode", title: "부서 코드", width: "120px" },
  { key: "deptName", title: "부서명" },
  { key: "parentDept", title: "상위 부서", width: "150px" },
  { key: "manager", title: "부서장", width: "120px" },
  {
    key: "employeeCount",
    title: "인원수",
    width: "80px",
    render: (value: number) => formatDepartmentHeadcount(value),
  },
  {
    key: "budget",
    title: "예산",
    width: "150px",
    render: (value: number) => formatDepartmentBudget(value),
  },
  {
    key: "status",
    title: "상태",
    width: "80px",
    render: (value: string) => (
      <Badge variant={getDepartmentStatusVariant(value)}>{value}</Badge>
    ),
  },
  { key: "createdDate", title: "생성일", width: "120px" },
];

export type { DepartmentRecord };
