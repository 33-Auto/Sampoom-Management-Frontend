import { http } from "msw";

import {
  mockPurchaseOrders,
  transformToPOResDto,
  type PurchaseOrderListItem,
} from "@/entities/purchase-order";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

type StockingMutationPayload = {
  purchaseOrderId?: number;
  warehouseId?: number;
  items?: Array<{
    id: number;
    delta: number;
  }>;
};

export const handlers = [
  http.get("/api/warehouse/po/:purchaseOrderId", async ({ params }) => {
    await sleep(350);
    const purchaseOrderId = Number(params.purchaseOrderId);

    if (!purchaseOrderId || Number.isNaN(purchaseOrderId)) {
      return apiFail(400, "유효한 purchaseOrderId가 필요합니다.");
    }

    // 발주 목록과 같은 데이터라 목록의 모든 발주가 열린다
    const detail = mockPurchaseOrders.find(
      (record) => record.purchaseOrderId === purchaseOrderId,
    );

    if (!detail) {
      return apiFail(404, "발주 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(transformToPOResDto(detail));
  }),

  http.patch("/api/warehouse/stocking", async ({ request }) => {
    await sleep(450);
    const payload = (await request.json()) as StockingMutationPayload;

    if (!payload.purchaseOrderId || !payload.warehouseId) {
      return apiFail(400, "purchaseOrderId와 warehouseId는 필수입니다.");
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return apiFail(400, "입고 품목 정보가 필요합니다.");
    }

    const detailIndex = mockPurchaseOrders.findIndex(
      (record) =>
        record.purchaseOrderId === payload.purchaseOrderId &&
        record.warehouseId === payload.warehouseId,
    );

    if (detailIndex === -1) {
      return apiFail(404, "입고 처리 대상을 찾을 수 없습니다.");
    }

    const detail = mockPurchaseOrders[detailIndex];
    const mutation = payload.items?.find((item) => item.id === detail.partId);

    if (!mutation) {
      return apiFail(404, "입고 처리 대상을 찾을 수 없습니다.");
    }

    const delta = Math.max(0, mutation.delta ?? 0);
    const actualInbound = Math.min(delta, detail.restQuantity);
    const restQuantity = Math.max(detail.restQuantity - actualInbound, 0);

    // 다 들어오면 COMPLETED, 남으면 PARTIAL로 두어 목록에선 완료·진행중으로 보인다
    const updatedDetail: PurchaseOrderListItem = {
      ...detail,
      inboundQuantity: detail.inboundQuantity + actualInbound,
      restQuantity,
      status: restQuantity === 0 ? "COMPLETED" : "PARTIAL",
      receivedDate: new Date().toISOString(),
    };

    // 목록 핸들러와 같은 배열을 고쳐야 목록에 반영된다
    mockPurchaseOrders[detailIndex] = updatedDetail;

    const statusMessage =
      updatedDetail.restQuantity === 0
        ? "모든 수량이 입고되었습니다."
        : `${updatedDetail.restQuantity}개가 아직 입고 대기 중입니다.`;

    return apiSuccess(
      {
        ...updatedDetail,
        message: statusMessage,
      },
      200,
      "입고 처리가 완료되었습니다.",
    );
  }),
];
