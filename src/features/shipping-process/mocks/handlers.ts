import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockShippingOrders, type ShippingOrder } from "./data";let shippingOrders = [...mockShippingOrders];

type ShippingMutationPayload = {
  warehouseId?: number;
  orderId?: number;
  items?: Array<{
    id: number;
    delta: number;
  }>;
};

export const handlers = [
  http.patch("/api/warehouse/delivery", async ({ request }) => {
    await sleep(500);
    const payload = (await request.json()) as ShippingMutationPayload;

    if (!payload.warehouseId || !payload.orderId) {
      return apiFail(400, "warehouseId와 orderId는 필수입니다.");
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return apiFail(400, "출고 품목이 필요합니다.");
    }

    const order = shippingOrders.find(
      (record) =>
        record.orderId === payload.orderId &&
        record.warehouseId === payload.warehouseId,
    );

    if (!order) {
      return apiFail(404, "출고 대상을 찾을 수 없습니다.");
    }

    const updatedItems = order.items.map((item) => {
      const mutation = payload.items?.find((v) => v.id === item.partId);
      if (!mutation) {
        return item;
      }

      const shippedQty = Math.min(
        item.availableStock,
        Math.min(item.orderQuantity, Math.abs(mutation.delta)),
      );

      return {
        ...item,
        availableStock: Math.max(item.availableStock - shippedQty, 0),
        orderQuantity: Math.max(item.orderQuantity - shippedQty, 0),
      };
    });

    const remaining = updatedItems.reduce(
      (sum, item) => sum + item.orderQuantity,
      0,
    );

    const updatedOrder: ShippingOrder = {
      ...order,
      status: remaining === 0 ? "SHIPPED" : "PARTIAL",
      items: updatedItems,
    };

    shippingOrders = shippingOrders.map((record) =>
      record.orderId === updatedOrder.orderId ? updatedOrder : record,
    );

    return apiSuccess(
      {
        orderId: updatedOrder.orderId,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        remainingQuantity: remaining,
        items: updatedItems,
      },
      200,
      "출고 처리가 완료되었습니다.",
    );
  }),
];
