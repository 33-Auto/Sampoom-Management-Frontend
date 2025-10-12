import type { RoutingStatus } from "@/pages/master/routings/model";import { ROUTING_STATUS } from "../model";export const formatRoutingStatus = (value?: RoutingStatus | null) => {
  if (!value) return "-";
  return value === "ACTIVE" ? "활성" : "비활성";
};

export const getRoutingStatusVariant = (
  value?: RoutingStatus | null,
): "success" | "default" => (value === "ACTIVE" ? "success" : "default");

export const buildRoutingStatusOptions = () => [
  { value: "", label: "전체 상태" },
  ...Object.entries(ROUTING_STATUS)
    .filter(([, value]) => value !== undefined)
    .map(([, value]) => ({
      value: value as string,
      label: formatRoutingStatus(value as RoutingStatus),
    })),
];

export const formatRoutingCategoryPath = (
  categoryName?: string | null,
  groupName?: string | null,
) => `${categoryName || "-"} > ${groupName || "-"}`;

export const formatRoutingMinutes = (value?: number | null) =>
  `${value ?? 0}분`;

export const formatRoutingStepCount = (value?: number | null) =>
  `${value ?? 0}개`;
