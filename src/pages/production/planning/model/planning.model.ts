import type { Operations, Schemas } from "@/shared/model";

export type ProductionPlanListParams = NonNullable<
  Operations["getProductionPlans"]["parameters"]["query"]
>;
export type ProductionPlanListResponse =
  Schemas["ApiResponsePageResponseDtoPartOrderResponseDto"];
export type ProductionPlanResponseDTO = Schemas["PartOrderResponseDto"];

export type ProductionPlanPriority = NonNullable<
  ProductionPlanListParams["priorities"]
>[number];

export type ProductionPlanStatus =
  | "UNDER_REVIEW"
  | "PURCHASE_REQUEST"
  | "PLAN_CONFIRMED"
  | "DELAYED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED";

export const PRODUCTION_PLAN_STATUS_LABELS: Record<string, string> = {
  UNDER_REVIEW: "검토중",
  PURCHASE_REQUEST: "구매요청",
  PLAN_CONFIRMED: "계획확정",
  DELAYED: "지연",
  REJECTED: "반려",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

export const PRODUCTION_PLAN_STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "info" | "success" | "warning" | "error"
> = {
  UNDER_REVIEW: "warning",
  PURCHASE_REQUEST: "info",
  PLAN_CONFIRMED: "success",
  DELAYED: "error",
  REJECTED: "error",
  IN_PROGRESS: "info",
  COMPLETED: "success",
};

export const PRODUCTION_PLAN_PRIORITY_LABELS: Record<string, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
};

export const PRODUCTION_PLAN_PRIORITY_BADGE_VARIANTS: Record<
  string,
  "default" | "info" | "success" | "warning" | "error"
> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "success",
};

export const DEFAULT_FACTORY_ID = 164;
export const DEFAULT_INCLUDE_RECENT_DAYS = -1;
