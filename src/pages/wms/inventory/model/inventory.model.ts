import type { Schemas, Operations } from "@/shared/model";

export type InventoryListParams = Operations["search"]["parameters"]["query"];
export type InventoryListResponse = Schemas["ApiResponsePagePartResDto"];
export type PartResDto = Schemas["PartResDto"];
export type InventoryStatus = InventoryListParams["quantityStatus"];
export const QUANTITY_STATUS = {
  ENOUGH: "ENOUGH",
  SHORT: "SHORT",
  DANGER: "DANGER",
  OVER: "OVER",
  undefined: undefined,
} as const satisfies Record<string, InventoryStatus | undefined>;

export type InventoryStatusKey = NonNullable<InventoryStatus>;

// 라벨 매핑을 위한 값들
export const INVENTORY_STATUS_LABELS: Record<InventoryStatusKey, string> = {
  ENOUGH: "정상",
  SHORT: "부족",
  DANGER: "위험",
  OVER: "과잉",
};

// 라벨 색상을 위한 값들
export const INVENTORY_STATUS_BADGE_VARIANTS: Record<
  InventoryStatusKey,
  "default" | "info" | "success" | "warning" | "error"
> = {
  ENOUGH: "success",
  SHORT: "warning",
  DANGER: "error",
  OVER: "info",
};
