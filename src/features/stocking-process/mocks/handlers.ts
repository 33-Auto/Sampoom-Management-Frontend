import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockStockingDetails, type StockingProcessDetail } from "./data";

let stockingDetails = [...mockStockingDetails];

type StockingMutationPayload = {
  purchaseOrderId?: number;
  warehouseId?: number;
  items?: Array<{
    id: number;
    delta: number;
  }>;
};

export const handlers = [
  http.get("*/api/warehouse/po/:purchaseOrderId", async ({ params }) => {
    await sleep(350);
    const purchaseOrderId = Number(params.purchaseOrderId);

    if (!purchaseOrderId || Number.isNaN(purchaseOrderId)) {
      return apiFail(400, "유효한 purchaseOrderId가 필요합니다.");
    }

    const detail = stockingDetails.find(
      (record) => record.purchaseOrderId === purchaseOrderId,
    );

    if (!detail) {
      return apiFail(404, "발주 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(detail);
  }),

  http.patch("*/api/warehouse/stocking", async ({ request }) => {
    await sleep(450);
    const payload = (await request.json()) as StockingMutationPayload;

    if (!payload.purchaseOrderId || !payload.warehouseId) {
      return apiFail(400, "purchaseOrderId와 warehouseId는 필수입니다.");
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return apiFail(400, "입고 품목 정보가 필요합니다.");
    }

    let updatedDetail: StockingProcessDetail | undefined;

    stockingDetails = stockingDetails.map((detail) => {
      if (
        detail.purchaseOrderId !== payload.purchaseOrderId ||
        detail.warehouseId !== payload.warehouseId
      ) {
        return detail;
      }

      const mutation = payload.items?.find((item) => item.id === detail.partId);

      if (!mutation) {
        return detail;
      }

      const delta = Math.max(0, mutation.delta ?? 0);
      const actualInbound = Math.min(delta, detail.restQuantity);

      updatedDetail = {
        ...detail,
        inboundQuantity: detail.inboundQuantity + actualInbound,
        restQuantity: Math.max(detail.restQuantity - actualInbound, 0),
        receivedDate: new Date().toISOString(),
      };

      return updatedDetail;
    });

    if (!updatedDetail) {
      return apiFail(404, "입고 처리 대상을 찾을 수 없습니다.");
    }

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
