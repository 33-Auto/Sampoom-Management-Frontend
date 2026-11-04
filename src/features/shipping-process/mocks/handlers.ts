import { http } from "msw";

import { mockShippingOrders, type ShippingListItem } from "@/entities/shipping";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { isShippableStatus } from "../lib/status";

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

    const orderIndex = mockShippingOrders.findIndex(
      (record) =>
        record.orderId === payload.orderId &&
        record.warehouseId === payload.warehouseId,
    );

    if (orderIndex === -1) {
      return apiFail(404, "출고 대상을 찾을 수 없습니다.");
    }

    const order = mockShippingOrders[orderIndex];

    // 취소, 완료, 출고 완료 뒤 단계를 다시 출고하면 상태가 SHIPPED로 덮인다
    if (!isShippableStatus(order.status)) {
      return apiFail(
        409,
        "출고 대기, 확정, 지연이거나 일부만 출고된 주문만 출고할 수 있습니다.",
      );
    }

    const updatedItems = order.items.map((item) => {
      const mutation = payload.items?.find((v) => v.id === item.partId);
      if (!mutation) {
        return item;
      }

      const shippedQty = Math.min(
        item.stock,
        Math.min(item.orderQuantity, Math.abs(mutation.delta)),
      );

      // 요청 수량은 남은 출고량으로 줄여 다음 출고 처리의 상한이 된다
      return {
        ...item,
        stock: Math.max(item.stock - shippedQty, 0),
        orderQuantity: Math.max(item.orderQuantity - shippedQty, 0),
      };
    });

    const remaining = updatedItems.reduce(
      (sum, item) => sum + item.orderQuantity,
      0,
    );

    // v1에 부분 출고 상태가 없어 남으면 출고 진행으로 둔다
    const updatedOrder: ShippingListItem = {
      ...order,
      status: remaining === 0 ? "SHIPPED" : "SHIPPING",
      items: updatedItems,
    };

    // 목록 핸들러와 같은 배열을 고쳐야 목록에 반영된다
    mockShippingOrders[orderIndex] = updatedOrder;

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
