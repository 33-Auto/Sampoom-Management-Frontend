import type { ShippingOrderDto } from "@/entities/shipping";

type ShippingStatus = NonNullable<ShippingOrderDto["status"]>;

// SHIPPING은 일부만 출고된 주문이라 남은 수량을 이어서 출고한다
const SHIPPABLE_STATUSES: readonly ShippingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "DELAYED",
  "SHIPPING",
];

export const isShippableStatus = (status?: string | null): boolean =>
  SHIPPABLE_STATUSES.some((shippable) => shippable === status);

// 출고 폼 최대치와 같게 품목마다 남은 수량과 재고를 함께 본다
export const canProcessShipping = (order: ShippingOrderDto): boolean =>
  isShippableStatus(order.status) &&
  (order.items ?? []).some(
    (item) => Math.min(item.orderQuantity ?? 0, item.stock ?? 0) > 0,
  );
