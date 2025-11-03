import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockReceivingProcessResponse } from "./data";

export const handlers = [
  // 입고 처리 조회 API
  http.get(
    "/api/warehouse/receiving/:warehouseId/process/:processId",
    async () => {
      await sleep(500);
      return apiSuccess(mockReceivingProcessResponse);
    },
  ),

  // 입고 처리 API
  http.post(
    "/api/warehouse/receiving/:warehouseId/process/:processId",
    async ({ params, request }) => {
      await sleep(800);
      const body = (await request.json()) as {
        receivingQuantity: number;
        receivingDate: string;
        receivingTime: string;
        note?: string;
      };

      const warehouseId = Number(params.warehouseId);
      const processId = Number(params.processId);

      // 유효성 검사
      if (!warehouseId || !processId) {
        return apiFail(400, "warehouseId와 processId는 필수입니다.");
      }

      if (!body.receivingQuantity || body.receivingQuantity <= 0) {
        return apiFail(400, "입고 수량은 1개 이상이어야 합니다.");
      }

      if (!body.receivingDate || !body.receivingTime) {
        return apiFail(400, "입고 날짜와 시간은 필수입니다.");
      }

      // 성공 응답
      const response: typeof mockReceivingProcessResponse = {
        ...mockReceivingProcessResponse,
        warehouseId,
        processId,
        receivingQuantity: body.receivingQuantity,
        receivingDate: body.receivingDate,
        receivingTime: body.receivingTime,
        note: body.note || mockReceivingProcessResponse.memo,
        createdAt: new Date().toISOString(),
      };

      return apiSuccess(
        response,
        200,
        "입고 처리가 성공적으로 완료되었습니다.",
      );
    },
  ),
];
