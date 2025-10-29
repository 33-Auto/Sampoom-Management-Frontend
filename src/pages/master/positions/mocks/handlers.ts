import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockPositionsMaster } from "./data";

export const positionsMasterHandlers = [
  http.get("/api/master/positions", async () => {
    await sleep(500);
    return apiSuccess(mockPositionsMaster);
  }),

  http.get("/api/master/positions/:positionCode", async ({ params }) => {
    await sleep(300);
    const positionCode = String(params.positionCode);
    const position = mockPositionsMaster.find(
      (p) => p.positionCode === positionCode,
    );
    if (!position) {
      return new Response(
        JSON.stringify({ error: "직급을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(position);
  }),

  http.post("/api/master/positions", async ({ request }) => {
    await sleep(400);
    const newPosition = (await request.json()) as Partial<
      (typeof mockPositionsMaster)[0]
    >;
    const createdPosition = {
      ...newPosition,
      positionCode: `POS-${String(mockPositionsMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdPosition, 201);
  }),

  http.put(
    "/api/master/positions/:positionCode",
    async ({ params, request }) => {
      await sleep(300);
      const updates = (await request.json()) as Partial<
        (typeof mockPositionsMaster)[0]
      >;
      const positionCode = String(params.positionCode);
      const position = mockPositionsMaster.find(
        (p) => p.positionCode === positionCode,
      );

      if (!position) {
        return new Response(
          JSON.stringify({ error: "직급을 찾을 수 없습니다" }),
          {
            status: 404,
          },
        );
      }

      const updatedPosition = { ...position, ...updates };
      return apiSuccess(updatedPosition);
    },
  ),
];
