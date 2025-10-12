import type { Operations, Schemas } from "@/shared/model";type SalesOrderPathParams =
  Operations["getWarehouseOrders"]["parameters"]["path"];
type SalesOrderQueryParams = NonNullable<
  Operations["getWarehouseOrders"]["parameters"]["query"]
>;

export type SalesOrderListParams = SalesOrderPathParams &
  Partial<SalesOrderQueryParams>;
export type SalesOrderListResponse = Schemas["ApiResponsePageOrderResDto"];
export type SalesOrderDto = Schemas["OrderResDto"];

export type SalesOrderStatus = NonNullable<SalesOrderQueryParams["status"]>;

export const SALES_ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  DELAYED: "DELAYED",
  SHIPPING: "SHIPPING",
  SHIPPED: "SHIPPED",
  DELIVERING: "DELIVERING",
  ARRIVED: "ARRIVED",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  undefined: undefined,
} as const satisfies Record<string, SalesOrderStatus | undefined>;

export const SALES_ORDER_STATUS_LABELS: Record<SalesOrderStatus, string> = {
  PENDING: "대기 중",
  CONFIRMED: "주문 확인",
  DELAYED: "배송 지연",
  SHIPPING: "배송 중",
  SHIPPED: "배송 완료(배송됨)",
  DELIVERING: "배송 중(이동 중)",
  ARRIVED: "도착 완료",
  COMPLETED: "처리 완료",
  CANCELED: "주문 취소",
};

export const SALES_ORDER_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "전체 상태" },
  { value: "PENDING", label: SALES_ORDER_STATUS_LABELS.PENDING },
  { value: "CONFIRMED", label: SALES_ORDER_STATUS_LABELS.CONFIRMED },
  { value: "SHIPPING", label: SALES_ORDER_STATUS_LABELS.SHIPPING },
  { value: "DELAYED", label: SALES_ORDER_STATUS_LABELS.DELAYED },
  { value: "SHIPPED", label: SALES_ORDER_STATUS_LABELS.SHIPPED },
  { value: "DELIVERING", label: SALES_ORDER_STATUS_LABELS.DELIVERING },
  { value: "ARRIVED", label: SALES_ORDER_STATUS_LABELS.ARRIVED },
  { value: "COMPLETED", label: SALES_ORDER_STATUS_LABELS.COMPLETED },
  { value: "CANCELED", label: SALES_ORDER_STATUS_LABELS.CANCELED },
] as const satisfies ReadonlyArray<{
  value: "ALL" | SalesOrderStatus;
  label: string;
}>;

export type SalesOrderStatusFilterValue =
  (typeof SALES_ORDER_STATUS_FILTER_OPTIONS)[number]["value"];
