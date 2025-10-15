import type { ShippingOrderDto, ShippingOrderItemDto } from "@/pages/wms/shipping/model";import type { ShippingProcessFormData } from "./shipping-process.contract";export type ShippingProcessItem = ShippingProcessFormData["items"][number];

export type ShippingProcessFormProps = {
  warehouseId: number;
  orderId: number;
  order: ShippingOrderDto;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export type ShippingProcessSummary = {
  totalRequested: number;
  totalAvailable: number;
  totalShipping: number;
  itemsCount: number;
};

export const toShippingProcessItems = (
  items: ShippingOrderItemDto[] | undefined,
): ShippingProcessItem[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (
        item,
      ): item is Required<Pick<ShippingOrderItemDto, "partId">> &
        ShippingOrderItemDto => typeof item.partId === "number",
    )
    .map((item) => {
      const orderQuantity = Number(item.orderQuantity ?? 0);
      const availableStock = Number(item.stock ?? 0);
      const defaultDelta = Math.max(0, Math.min(orderQuantity, availableStock));

      return {
        partId: Number(item.partId),
        partName: item.name ?? "-",
        partCode: item.code ?? "-",
        orderQuantity,
        availableStock,
        delta: defaultDelta,
      };
    });
};
