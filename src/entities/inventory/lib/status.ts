import { INVENTORY_STATUS_LABELS, type InventoryStatusKey } from "@/pages/wms";const LABEL_TO_STATUS: Record<string, InventoryStatusKey> = Object.entries(
  INVENTORY_STATUS_LABELS,
).reduce(
  (acc, [key, label]) => {
    acc[label] = key as InventoryStatusKey;
    return acc;
  },
  {} as Record<string, InventoryStatusKey>,
);

export const isInventoryStatus = (
  status: string,
): status is InventoryStatusKey =>
  Object.prototype.hasOwnProperty.call(INVENTORY_STATUS_LABELS, status);

export const normalizeInventoryStatus = (
  status?: string | null,
): InventoryStatusKey | undefined => {
  if (!status) return undefined;
  const upper = status.toUpperCase();
  if (isInventoryStatus(upper)) {
    return upper;
  }
  return LABEL_TO_STATUS[status];
};
