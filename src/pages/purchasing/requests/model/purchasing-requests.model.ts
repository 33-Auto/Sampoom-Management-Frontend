import type { Schemas, Operations } from "@/shared/model";

export type PurchaseRequestListParams =
  Operations["getOrders"]["parameters"]["query"];
export type PurchaseRequestListResponse =
  Schemas["ApiResponsePageResponseDtoPurchaseOrderResponseDto"];
export type PurchaseOrderResponseDto = Schemas["PurchaseOrderResponseDto"];

export type PurchaseRequestStatus =
  NonNullable<PurchaseRequestListParams>["status"];
export type PurchaseRequestUrgency =
  NonNullable<PurchaseRequestListParams>["urgency"];

export const PURCHASE_REQUEST_STATUS = {
  ORDERED: "ORDERED",
  RECEIVED: "RECEIVED",
  CANCELED: "CANCELED",
  undefined: undefined,
} as const satisfies Record<string, PurchaseRequestStatus | undefined>;

export const PURCHASE_REQUEST_URGENCY = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  undefined: undefined,
} as const satisfies Record<string, PurchaseRequestUrgency | undefined>;
