import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockBomDetails, type MockBomDetail } from "./data";

let bomDetails = [...mockBomDetails];

export const handlers = [
  http.get("*/api/part/boms/:bomId", async ({ params }) => {
    await sleep(400);

    // params.bomId가 없거나 undefined인지 확인
    if (!params.bomId || params.bomId === undefined || params.bomId === null) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    // "search"와 같은 특수 경로는 이 핸들러에서 처리하지 않음
    if (params.bomId === "search") {
      return;
    }

    const bomId = Number(params.bomId);

    if (Number.isNaN(bomId) || bomId <= 0) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    const bom = bomDetails.find((item) => item.bomId === bomId);

    if (!bom) {
      return apiFail(404, "BOM 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(bom);
  }),

  http.post("*/api/part/boms", async ({ request }) => {
    await sleep(500);
    const payload = (await request.json()) as Partial<MockBomDetail>;

    if (!payload.bomName) {
      return apiFail(400, "BOM 이름은 필수입니다.");
    }

    const nextId =
      bomDetails.reduce((max, item) => Math.max(max, item.bomId), 0) + 1;

    const nextBom: MockBomDetail = {
      bomId: nextId,
      bomName: payload.bomName,
      version: payload.version ?? "v1.0",
      status: payload.status ?? "ACTIVE",
      complexity: payload.complexity ?? "NORMAL",
      description: payload.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      materials: payload.materials ?? [],
    };

    bomDetails = [...bomDetails, nextBom];

    return apiSuccess(nextBom, 201, "BOM이 생성되었습니다.");
  }),

  http.put("*/api/part/boms/:bomId", async ({ params, request }) => {
    await sleep(450);

    // params.bomId가 없거나 undefined인지 확인
    if (!params.bomId || params.bomId === undefined || params.bomId === null) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    // "search"와 같은 특수 경로는 이 핸들러에서 처리하지 않음
    if (params.bomId === "search") {
      return;
    }

    const bomId = Number(params.bomId);

    if (Number.isNaN(bomId) || bomId <= 0) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<MockBomDetail>;
    let updatedBom: MockBomDetail | undefined;

    bomDetails = bomDetails.map((bom) => {
      if (bom.bomId !== bomId) {
        return bom;
      }

      updatedBom = {
        ...bom,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedBom;
    });

    if (!updatedBom) {
      return apiFail(404, "BOM 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedBom, 200, "BOM이 수정되었습니다.");
  }),

  http.delete("*/api/part/boms/:bomId", async ({ params }) => {
    await sleep(300);

    // params.bomId가 없거나 undefined인지 확인
    if (!params.bomId || params.bomId === undefined || params.bomId === null) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    // "search"와 같은 특수 경로는 이 핸들러에서 처리하지 않음
    if (params.bomId === "search") {
      return;
    }

    const bomId = Number(params.bomId);

    if (Number.isNaN(bomId) || bomId <= 0) {
      return apiFail(400, "유효한 BOM ID가 필요합니다.");
    }

    const beforeLength = bomDetails.length;
    bomDetails = bomDetails.filter((bom) => bom.bomId !== bomId);

    if (beforeLength === bomDetails.length) {
      return apiFail(404, "삭제할 BOM을 찾을 수 없습니다.");
    }

    return apiSuccess(null, 200, "BOM이 삭제되었습니다.");
  }),
];
