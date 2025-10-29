import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockItemsMaster } from "./data";

export const itemsMasterHandlers = [
  // 전체 품목 목록 조회
  http.get("/api/master/items", async () => {
    await sleep(500);
    return apiSuccess(mockItemsMaster);
  }),

  // 특정 품목 조회
  http.get("/api/master/items/:itemCode", async ({ params }) => {
    await sleep(300);
    const itemCode = String(params.itemCode);
    const item = mockItemsMaster.find((i) => i.itemCode === itemCode);
    if (!item) {
      return new Response(
        JSON.stringify({ error: "품목을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(item);
  }),

  // 품목 등록
  http.post("/api/master/items", async ({ request }) => {
    await sleep(400);
    const newItem = (await request.json()) as Partial<
      (typeof mockItemsMaster)[0]
    >;
    const createdItem = {
      ...newItem,
      itemCode: `MAT-${String(mockItemsMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdItem, 201);
  }),

  // 품목 수정
  http.put("/api/master/items/:itemCode", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as Partial<
      (typeof mockItemsMaster)[0]
    >;
    const itemCode = String(params.itemCode);
    const item = mockItemsMaster.find((i) => i.itemCode === itemCode);

    if (!item) {
      return new Response(
        JSON.stringify({ error: "품목을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }

    const updatedItem = { ...item, ...updates };
    return apiSuccess(updatedItem);
  }),

  // 상태별 품목 조회
  http.get("/api/master/items/status/:status", async ({ params }) => {
    await sleep(400);
    const filteredItems = mockItemsMaster.filter(
      (item) => item.status === params.status,
    );
    return apiSuccess(filteredItems);
  }),

  // 타입별 품목 조회
  http.get("/api/master/items/type/:type", async ({ params }) => {
    await sleep(400);
    const filteredItems = mockItemsMaster.filter(
      (item) => item.itemType === params.type,
    );
    return apiSuccess(filteredItems);
  }),
];
