import {
  PURCHASE_ORDER_STATUS_LABELS,
  type PurchaseOrderStatusKey,
} from "@/pages/wms/purchase-orders/model";

export const STATUS_ORDER: PurchaseOrderStatusKey[] = [
  "PENDING",
  "UNDER_REVIEW",
  "PLAN_CONFIRMED",
  "CONFIRMED",
  "PRODUCING",
  "IN_PROGRESS",
  "SHIPPING",
  "ARRIVED",
  "DELAYED",
  "COMPLETED",
  "CANCELED",
];

const LABEL_TO_STATUS: Record<string, PurchaseOrderStatusKey> = Object.entries(
  PURCHASE_ORDER_STATUS_LABELS,
).reduce(
  (acc, [key, label]) => {
    acc[label] = key as PurchaseOrderStatusKey;
    return acc;
  },
  {} as Record<string, PurchaseOrderStatusKey>,
);

export const isPurchaseOrderStatus = (
  status: string,
): status is PurchaseOrderStatusKey =>
  Object.prototype.hasOwnProperty.call(PURCHASE_ORDER_STATUS_LABELS, status);

export const normalizePurchaseOrderStatus = (
  status?: string | null,
): PurchaseOrderStatusKey | undefined => {
  if (!status) return undefined;
  const upper = status.toUpperCase();
  if (isPurchaseOrderStatus(upper)) {
    return upper;
  }
  return LABEL_TO_STATUS[status];
};
