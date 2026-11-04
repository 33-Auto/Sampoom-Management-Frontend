import { http } from "msw";

import {
  mockWorkCentersMaster,
  type WorkCenterRecord,
} from "@/entities/workcenter";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";
import type { Schemas } from "@/shared/model";

type WorkCenterCreateRequest = Schemas["WorkCenterCreateRequestDTO"];
type WorkCenterUpdateRequest = Schemas["WorkCenterUpdateRequestDTO"];

// 목록과 같은 배열이라 제자리에서 고쳐야 목록에 바로 보인다
export const handlers = [
  http.post("/api/part/work-centers", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as WorkCenterCreateRequest;

    if (!payload.name || !payload.type) {
      return apiFail(400, "작업장명과 유형은 필수입니다.");
    }

    const nextId =
      mockWorkCentersMaster.reduce(
        (max, center) => Math.max(max, center.id),
        0,
      ) + 1;

    const nextRecord: WorkCenterRecord = {
      id: nextId,
      name: payload.name,
      // 폼이 코드를 보내지 않아 id로 만든다
      code: `WC-${String(nextId).padStart(3, "0")}`,
      type: payload.type,
      status: payload.status ?? "ACTIVE",
      dailyOperatingHours: payload.dailyOperatingHours ?? 8,
      efficiency: payload.efficiency ?? 85,
      costPerHour: payload.costPerHour ?? 150000,
    };

    // 새 항목은 첫 페이지에서 바로 보이게 앞에 넣는다
    mockWorkCentersMaster.unshift(nextRecord);

    return apiSuccess(nextRecord, 201, "작업장이 생성되었습니다.");
  }),

  http.patch("/api/part/work-centers/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 작업장 ID가 필요합니다.");
    }

    const payload = (await request.json()) as WorkCenterUpdateRequest;
    const updatedCenter = mockWorkCentersMaster.find(
      (center) => center.id === id,
    );

    if (!updatedCenter) {
      return apiFail(404, "작업장을 찾을 수 없습니다.");
    }

    // 부분 수정이라 보낸 필드만 덮어쓴다
    Object.assign(updatedCenter, payload);

    return apiSuccess(updatedCenter, 200, "작업장이 수정되었습니다.");
  }),

  http.delete("/api/part/work-centers/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 작업장 ID가 필요합니다.");
    }

    const targetIndex = mockWorkCentersMaster.findIndex(
      (center) => center.id === id,
    );

    if (targetIndex === -1) {
      return apiFail(404, "삭제할 작업장을 찾을 수 없습니다.");
    }

    mockWorkCentersMaster.splice(targetIndex, 1);

    return apiSuccess(null, 200, "작업장이 삭제되었습니다.");
  }),
];
