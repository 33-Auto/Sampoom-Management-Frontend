import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockWorkCenters, type WorkCenterRecord } from "./data";

let workCenters = [...mockWorkCenters];

export const handlers = [
  http.post("/api/part/work-centers", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as Partial<WorkCenterRecord>;

    if (!payload.name || !payload.type) {
      return apiFail(400, "작업장명과 유형은 필수입니다.");
    }

    const nextId =
      workCenters.reduce((max, center) => Math.max(max, center.id), 0) + 1;

    const nextRecord: WorkCenterRecord = {
      id: nextId,
      name: payload.name,
      code: payload.code ?? `WC-${String(nextId).padStart(3, "0")}`,
      type: payload.type,
      status: payload.status ?? "ACTIVE",
      dailyOperatingHours: payload.dailyOperatingHours ?? 8,
      efficiency: payload.efficiency ?? 85,
      costPerHour: payload.costPerHour ?? 150000,
    };

    workCenters = [...workCenters, nextRecord];

    return apiSuccess(nextRecord, 201, "작업장이 생성되었습니다.");
  }),

  http.patch("/api/part/work-centers/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 작업장 ID가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<WorkCenterRecord>;
    let updatedCenter: WorkCenterRecord | undefined;

    workCenters = workCenters.map((center) => {
      if (center.id !== id) {
        return center;
      }

      updatedCenter = {
        ...center,
        ...payload,
      };

      return updatedCenter;
    });

    if (!updatedCenter) {
      return apiFail(404, "작업장을 찾을 수 없습니다.");
    }

    return apiSuccess(updatedCenter, 200, "작업장이 수정되었습니다.");
  }),

  http.delete("/api/part/work-centers/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 작업장 ID가 필요합니다.");
    }

    const beforeLength = workCenters.length;
    workCenters = workCenters.filter((center) => center.id !== id);

    if (beforeLength === workCenters.length) {
      return apiFail(404, "삭제할 작업장을 찾을 수 없습니다.");
    }

    return apiSuccess(null, 200, "작업장이 삭제되었습니다.");
  }),
];
