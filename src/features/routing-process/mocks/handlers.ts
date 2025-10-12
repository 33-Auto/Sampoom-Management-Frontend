import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockRoutingRecords, type RoutingRecord } from "./data";let routingRecords = [...mockRoutingRecords];

export const handlers = [
  http.post("/api/part/processes", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as Partial<RoutingRecord>;

    if (!payload.name || !payload.code) {
      return apiFail(400, "공정명과 공정 코드는 필수입니다.");
    }

    const nextId =
      routingRecords.reduce((max, record) => Math.max(max, record.id), 0) + 1;

    const nextRecord: RoutingRecord = {
      id: nextId,
      name: payload.name,
      code: payload.code,
      description: payload.description,
      status: payload.status ?? "ACTIVE",
      steps: payload.steps ?? [],
    };

    routingRecords = [...routingRecords, nextRecord];

    return apiSuccess(nextRecord, 201, "라우팅이 생성되었습니다.");
  }),

  http.put("/api/part/processes/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 라우팅 ID가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<RoutingRecord>;
    let updatedRecord: RoutingRecord | undefined;

    routingRecords = routingRecords.map((record) => {
      if (record.id !== id) {
        return record;
      }

      updatedRecord = {
        ...record,
        ...payload,
      };

      return updatedRecord;
    });

    if (!updatedRecord) {
      return apiFail(404, "라우팅 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedRecord, 200, "라우팅이 수정되었습니다.");
  }),

  http.delete("/api/part/processes/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 라우팅 ID가 필요합니다.");
    }

    const beforeLength = routingRecords.length;
    routingRecords = routingRecords.filter((record) => record.id !== id);

    if (beforeLength === routingRecords.length) {
      return apiFail(404, "삭제할 라우팅을 찾을 수 없습니다.");
    }

    return apiSuccess(null, 200, "라우팅이 삭제되었습니다.");
  }),
];
