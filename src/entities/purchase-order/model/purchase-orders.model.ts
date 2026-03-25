import type { Schemas, Operations } from "@/shared/model";

export type PurchaseOrderListParams =
  Operations["getPurchaseOrders"]["parameters"]["query"];
export type PurchaseOrderListResponse = Schemas["ApiResponsePagePOResDto"];
export type POResDto = Schemas["POResDto"];
type BackendStatus = NonNullable<PurchaseOrderListParams["status"]>;

export type PurchaseOrderStatusKey =
  | BackendStatus
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "PRODUCING"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELED";

export const PURCHASE_ORDER_STATUS_LABELS: Record<
  PurchaseOrderStatusKey,
  string
> = {
  UNDER_REVIEW: "검토중",
  PLAN_CONFIRMED: "계획 확정",
  DELAYED: "지연",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
  PENDING: "대기",
  CONFIRMED: "확정",
  SHIPPING: "배송중",
  PRODUCING: "생산중",
  ARRIVED: "도착",
  CANCELED: "취소",
};

export const PURCHASE_ORDER_STATUS_BADGE_VARIANTS: Record<
  PurchaseOrderStatusKey,
  "default" | "info" | "success" | "warning" | "error"
> = {
  UNDER_REVIEW: "warning",
  PLAN_CONFIRMED: "info",
  DELAYED: "error",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  PENDING: "default",
  CONFIRMED: "info",
  SHIPPING: "info",
  PRODUCING: "info",
  ARRIVED: "success",
  CANCELED: "error",
};
