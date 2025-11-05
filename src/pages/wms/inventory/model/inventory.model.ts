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
