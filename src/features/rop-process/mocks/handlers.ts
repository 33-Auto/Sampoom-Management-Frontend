import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockRopRecords, type RopRecord } from "./data";let ropRecords = [...mockRopRecords];

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

    const nextRecord: RopRecord = {
      ropId: nextId,
      warehouseId: payload.warehouseId,
      partId: payload.partId ?? nextId,
      partCode: payload.partCode,
      partName: payload.partName ?? payload.partCode,
      categoryName: payload.categoryName ?? "미지정 카테고리",
      groupName: payload.groupName ?? "미지정 그룹",
      leadTime: payload.leadTime ?? 7,
      averageDaily: payload.averageDaily ?? 10,
      rop: calculateRop(payload.averageDaily ?? 10, payload.leadTime ?? 7),
      maxStock: payload.maxStock ?? 200,
      autoOrderStatus: payload.autoOrderStatus ?? "ACTIVE",
      autoCalStatus: payload.autoCalStatus ?? "ACTIVE",
    };

    ropRecords = [...ropRecords, nextRecord];

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

    let updatedRecord: RopRecord | undefined;

    ropRecords = ropRecords.map((record) => {
      if (record.ropId !== payload.ropId) {
        return record;
      }

      updatedRecord = {
        ...record,
        ...payload,
        rop: calculateRop(
          payload.averageDaily ?? record.averageDaily,
          payload.leadTime ?? record.leadTime,
        ),
      };

      return updatedRecord;
    });

    if (!updatedRecord) {
      return apiFail(404, "ROP 설정을 찾을 수 없습니다.");
    }

    return apiSuccess(updatedRecord, 200, "ROP 설정이 수정되었습니다.");
  }),

  http.delete("/api/warehouse/rop/:ropId", async ({ params }) => {
    await sleep(300);
    const ropId = Number(params.ropId);

    if (!ropId || Number.isNaN(ropId)) {
      return apiFail(400, "유효한 ropId가 필요합니다.");
    }

    const beforeLength = ropRecords.length;
    ropRecords = ropRecords.filter((record) => record.ropId !== ropId);

    if (beforeLength === ropRecords.length) {
      return apiFail(404, "삭제할 ROP 설정을 찾을 수 없습니다.");
    }

    return apiSuccess(null, 200, "ROP 설정이 삭제되었습니다.");
  }),
];
