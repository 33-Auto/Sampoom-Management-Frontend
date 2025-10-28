import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockFactoryBOMs } from "./data";

export const factoryBOMHandlers = [
  // 전체 BOM 목록 조회
  http.get("/api/factory/bom", async () => {
    await sleep(500);
    return apiSuccess(mockFactoryBOMs);
  }),

  // 특정 BOM 조회
  http.get("/api/factory/bom/:bomId", async ({ params }) => {
    await sleep(300);
    const bomId = String(params.bomId);
    const bom = mockFactoryBOMs.find((b) => b.id === bomId);
    if (!bom) {
      return new Response(JSON.stringify({ error: "BOM을 찾을 수 없습니다" }), {
        status: 404,
      });
    }
    return apiSuccess(bom);
  }),

  // BOM 등록
  http.post("/api/factory/bom", async ({ request }) => {
    await sleep(400);
    const newBOM = (await request.json()) as Partial<
      (typeof mockFactoryBOMs)[0]
    >;
    const createdBOM = {
      ...newBOM,
      id: `BOM-${String(mockFactoryBOMs.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdBOM, 201);
  }),

  // BOM 수정
  http.put("/api/factory/bom/:bomId", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as Partial<
      (typeof mockFactoryBOMs)[0]
    >;
    const bomId = String(params.bomId);
    const bom = mockFactoryBOMs.find((b) => b.id === bomId);

    if (!bom) {
      return new Response(JSON.stringify({ error: "BOM을 찾을 수 없습니다" }), {
        status: 404,
      });
    }

    const updatedBOM = { ...bom, ...updates };
    return apiSuccess(updatedBOM);
  }),

  // 상태별 BOM 조회
  http.get("/api/factory/bom/status/:status", async ({ params }) => {
    await sleep(400);
    const filteredBOMs = mockFactoryBOMs.filter(
      (bom) => bom.status === params.status,
    );
    return apiSuccess(filteredBOMs);
  }),
];
