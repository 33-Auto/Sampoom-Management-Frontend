import type { Operations, Schemas } from "@/shared/model";

export type PartOrderListParams = NonNullable<
  Operations["getPartOrders"]["parameters"]["query"]
>;
export type PartOrderListResponse =
  Schemas["ApiResponsePageResponseDtoPartOrderResponseDto"];
export type PartOrderResponseDTO = Schemas["PartOrderResponseDto"];

export type PartOrderStatus =
  | "UNDER_REVIEW"
  | "PURCHASE_REQUEST"
  | "PLAN_CONFIRMED"
  | "DELAYED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type PartOrderPriority = "HIGH" | "MEDIUM" | "LOW";

export const PART_ORDER_STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

export const PART_ORDER_STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "info" | "success" | "warning" | "error"
> = {
  UNDER_REVIEW: "warning",
  PURCHASE_REQUEST: "info",
  PLAN_CONFIRMED: "info",
  DELAYED: "error",
  REJECTED: "error",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};

export const PART_ORDER_PRIORITY_LABELS: Record<string, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

export const PART_ORDER_PRIORITY_BADGE_VARIANTS: Record<
  string,
  "default" | "info" | "success" | "warning" | "error"
> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

export const DEFAULT_PART_ORDER_STATUSES: PartOrderStatus[] = [
  "IN_PROGRESS",
  // "COMPLETED",
];
