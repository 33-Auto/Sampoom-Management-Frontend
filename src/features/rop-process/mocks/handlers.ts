import { http } from "msw";

import { mockItemsMaster } from "@/entities/part";
import {
  mockRopSettings,
  type RopSettingsRecord as RopRecord,
} from "@/entities/rop";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

// 목록 핸들러와 같은 배열이라 재할당하지 않고 그 자리에서 바꾼다
const ropRecords = mockRopSettings;

const calculateRop = (averageDaily: number, leadTime: number) =>
  Math.max(Math.round((averageDaily || 0) * (leadTime || 0)), 0);

export const handlers = [
  http.post("/api/warehouse/rop/create", async ({ request }) => {
    await sleep(450);
    const payload = (await request.json()) as Partial<RopRecord> & {
      partCode?: string;
      warehouseId?: number;
      leadTime?: number;
      averageDaily?: number;
      maxStock?: number;
    };

    if (!payload.partCode || !payload.warehouseId) {
      return apiFail(400, "partCode와 warehouseId는 필수입니다.");
    }

    const nextId =
      ropRecords.reduce((max, record) => Math.max(max, record.ropId), 0) + 1;

    // 요청엔 partCode만 오니 품목명과 분류는 품목 목 데이터에서 채운다
    const part = mockItemsMaster.find((item) => item.code === payload.partCode);

    const nextRecord: RopRecord = {
      ropId: nextId,
      warehouseId: payload.warehouseId,
      partId: payload.partId ?? part?.id ?? nextId,
      partCode: payload.partCode,
      partName: payload.partName ?? part?.name ?? payload.partCode,
      categoryName:
        payload.categoryName ?? part?.categoryName ?? "미지정 카테고리",
      groupName: payload.groupName ?? part?.groupName ?? "미지정 그룹",
      leadTime: payload.leadTime ?? 7,
      averageDaily: payload.averageDaily ?? 10,
      rop: calculateRop(payload.averageDaily ?? 10, payload.leadTime ?? 7),
      maxStock: payload.maxStock ?? 200,
      autoOrderStatus: payload.autoOrderStatus ?? "ACTIVE",
      autoCalStatus: payload.autoCalStatus ?? "ACTIVE",
    };

    ropRecords.push(nextRecord);

    return apiSuccess(nextRecord, 201, "ROP 설정이 생성되었습니다.");
  }),

  http.patch("/api/warehouse/rop", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as Partial<RopRecord> & {
      ropId?: number;
      leadTime?: number;
      averageDaily?: number;
      maxStock?: number;
    };

    if (!payload.ropId) {
      return apiFail(400, "ropId는 필수입니다.");
    }

    const index = ropRecords.findIndex(
      (record) => record.ropId === payload.ropId,
    );

    if (index === -1) {
      return apiFail(404, "ROP 설정을 찾을 수 없습니다.");
    }

    const record = ropRecords[index];
    const updatedRecord: RopRecord = {
      ...record,
      ...payload,
      rop: calculateRop(
        payload.averageDaily ?? record.averageDaily,
        payload.leadTime ?? record.leadTime,
      ),
    };

    ropRecords[index] = updatedRecord;

    return apiSuccess(updatedRecord, 200, "ROP 설정이 수정되었습니다.");
  }),

  http.delete("/api/warehouse/rop/:ropId", async ({ params }) => {
    await sleep(300);
    const ropId = Number(params.ropId);

    if (!ropId || Number.isNaN(ropId)) {
      return apiFail(400, "유효한 ropId가 필요합니다.");
    }

    const index = ropRecords.findIndex((record) => record.ropId === ropId);

    if (index === -1) {
      return apiFail(404, "삭제할 ROP 설정을 찾을 수 없습니다.");
    }

    ropRecords.splice(index, 1);

    return apiSuccess(null, 200, "ROP 설정이 삭제되었습니다.");
  }),
];
