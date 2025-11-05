import type { Schemas, Operations } from "@/shared/model";

export type PurchaseOrderListParams =
  Operations["getPurchaseOrders"]["parameters"]["query"];
export type PurchaseOrderListResponse = Schemas["ApiResponsePagePOResDto"];
export type POResDto = Schemas["POResDto"];
export type PurchaseOrderStatus = PurchaseOrderListParams["status"];

// 현재 백엔드에서 상태가 다 모여 있으므로 내가 원하는 것만 처리한다.
// 일단 그냥 뿌려주자
// TODO 탭에 따라 상태를 나누도록 백엔드와 합의보기
export const PURCHASE_ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELAYED: "DELAYED",
  PRODUCING: "PRODUCING",
  ARRIVED: "ARRIVED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  undefined: undefined,
} as const satisfies Record<string, PurchaseOrderStatus | undefined>;
