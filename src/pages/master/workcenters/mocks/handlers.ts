import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockWorkCentersMaster } from "./data";

export const workCentersMasterHandlers = [
  http.get("/api/master/workcenters", async () => {
    await sleep(500);
    return apiSuccess(mockWorkCentersMaster);
  }),

  http.get("/api/master/workcenters/:workCenterCode", async ({ params }) => {
    await sleep(300);
    const workCenterCode = String(params.workCenterCode);
    const workCenter = mockWorkCentersMaster.find(
      (w) => w.workCenterCode === workCenterCode,
    );
    if (!workCenter) {
      return new Response(
        JSON.stringify({ error: "작업장을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(workCenter);
  }),

  http.post("/api/master/workcenters", async ({ request }) => {
    await sleep(400);
    const newWorkCenter = (await request.json()) as Partial<
      (typeof mockWorkCentersMaster)[0]
    >;
    const createdWorkCenter = {
      ...newWorkCenter,
      workCenterCode: `WC-${String(mockWorkCentersMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdWorkCenter, 201);
  }),

  http.put(
    "/api/master/workcenters/:workCenterCode",
    async ({ params, request }) => {
      await sleep(300);
      const updates = (await request.json()) as Partial<
        (typeof mockWorkCentersMaster)[0]
      >;
      const workCenterCode = String(params.workCenterCode);
      const workCenter = mockWorkCentersMaster.find(
        (w) => w.workCenterCode === workCenterCode,
      );

      if (!workCenter) {
        return new Response(
          JSON.stringify({ error: "작업장을 찾을 수 없습니다" }),
          {
            status: 404,
          },
        );
      }

      const updatedWorkCenter = { ...workCenter, ...updates };
      return apiSuccess(updatedWorkCenter);
    },
  ),
];
