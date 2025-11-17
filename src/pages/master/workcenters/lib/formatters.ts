import type {
  WorkCenterStatus,
  WorkCenterType,
} from "@/pages/master/workcenters/model";
import {
  WORK_CENTER_STATUS,
  WORK_CENTER_TYPE,
} from "@/pages/master/workcenters/model";

type WorkCenterTypeKey = Exclude<WorkCenterType, undefined>;
type WorkCenterStatusKey = Exclude<WorkCenterStatus, undefined>;

const TYPE_LABELS: Record<WorkCenterTypeKey, string> = {
  INTERNAL: "내부 설비",
  EXTERNAL: "외주 가공처",
};

const STATUS_LABELS: Record<WorkCenterStatusKey, string> = {
  ACTIVE: "가동",
  INACTIVE: "중단",
  MAINTENANCE: "정비",
};

export const formatWorkCenterType = (value?: WorkCenterType | null) => {
  if (!value) return "-";
  const key = value as WorkCenterTypeKey;
  return TYPE_LABELS[key] ?? value;
};

export const getWorkCenterTypeBadgeVariant = (
  value?: WorkCenterType | null,
): "default" | "warning" => {
  if (!value) return "default";
  return value === "INTERNAL" ? "default" : "warning";
};

export const formatWorkCenterStatus = (value?: WorkCenterStatus | null) => {
  if (!value) return "-";
  const key = value as WorkCenterStatusKey;
  return STATUS_LABELS[key] ?? value;
};

export const getWorkCenterStatusVariant = (
  value?: WorkCenterStatus | null,
): "success" | "default" | "warning" => {
  switch (value) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "default";
    case "MAINTENANCE":
      return "warning";
    default:
      return "default";
  }
};

export const formatOperatingHours = (value?: number | null) =>
  `${value ?? 0}시간`;

export const formatEfficiency = (value?: number | null) => `${value ?? 0}%`;

export const formatCostPerHour = (value?: number | null) => {
  if (typeof value !== "number") return "-";
  return `₩${Number(value).toLocaleString()}`;
};

const definedWorkCenterTypes = Object.values(WORK_CENTER_TYPE).filter(
  (value): value is WorkCenterTypeKey => value !== undefined,
);

const definedWorkCenterStatuses = Object.values(WORK_CENTER_STATUS).filter(
  (value): value is WorkCenterStatusKey => value !== undefined,
);

export const buildWorkCenterTypeOptions = () => [
  { value: "", label: "전체 유형" },
  ...definedWorkCenterTypes.map((value) => ({
    value,
    label: formatWorkCenterType(value),
  })),
];

export const buildWorkCenterStatusOptions = () => [
  { value: "", label: "전체 상태" },
  ...definedWorkCenterStatuses.map((value) => ({
    value,
    label: formatWorkCenterStatus(value),
  })),
];
