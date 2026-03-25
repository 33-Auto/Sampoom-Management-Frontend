import type { BranchStatus, BranchType } from "@/entities/branch";
import { BRANCH_STATUS, BRANCH_TYPE } from "@/entities/branch";

const TYPE_LABELS: Record<BranchType, string> = {
  WAREHOUSE: "창고",
  FACTORY: "공장",
};

const STATUS_LABELS: Record<BranchStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

export const formatBranchType = (value?: BranchType | null) => {
  if (!value) return "-";
  return TYPE_LABELS[value] ?? value;
};

export const getBranchTypeBadgeVariant = (
  value?: BranchType | null,
): "default" | "warning" => {
  if (!value) return "default";
  return value === "WAREHOUSE" ? "default" : "warning";
};

export const formatBranchStatus = (value?: BranchStatus | null) => {
  if (!value) return "-";
  return STATUS_LABELS[value] ?? value;
};

export const getBranchStatusVariant = (
  value?: BranchStatus | null,
): "success" | "default" => {
  switch (value) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
    default:
      return "default";
  }
};

export const buildBranchTypeOptions = () => [
  { value: "", label: "전체 유형" },
  ...Object.entries(BRANCH_TYPE)
    .filter(([, value]) => value !== undefined)
    .map(([, value]) => ({
      value: value as string,
      label: formatBranchType(value as BranchType),
    })),
];

export const buildBranchStatusOptions = () => [
  { value: "", label: "전체 상태" },
  ...Object.entries(BRANCH_STATUS)
    .filter(([, value]) => value !== undefined)
    .map(([, value]) => ({
      value: value as string,
      label: formatBranchStatus(value as BranchStatus),
    })),
];
