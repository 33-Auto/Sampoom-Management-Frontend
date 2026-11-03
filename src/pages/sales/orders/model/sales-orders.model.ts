import type { Operations, Schemas } from "@/shared/model";

type SalesOrderPathParams =
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

// 목록과 상세가 같은 배지 색을 쓴다
export const SALES_ORDER_STATUS_BADGE_CLASS: Record<SalesOrderStatus, string> =
  {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    DELAYED: "bg-orange-100 text-orange-800",
    SHIPPING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-sky-100 text-sky-800",
    DELIVERING: "bg-teal-100 text-teal-800",
    ARRIVED: "bg-emerald-100 text-emerald-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-gray-100 text-gray-800",
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
