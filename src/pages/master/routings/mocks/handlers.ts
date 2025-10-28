import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockRoutingsMaster } from "./data";

export const routingsMasterHandlers = [
  http.get("/api/master/routings", async () => {
    await sleep(500);
    return apiSuccess(mockRoutingsMaster);
  }),

  http.get("/api/master/routings/:routingCode", async ({ params }) => {
    await sleep(300);
    const routingCode = String(params.routingCode);
    const routing = mockRoutingsMaster.find(
      (r) => r.routingCode === routingCode,
    );
    if (!routing) {
      return new Response(
        JSON.stringify({ error: "공정을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(routing);
  }),

  http.post("/api/master/routings", async ({ request }) => {
    await sleep(400);
    const newRouting = (await request.json()) as Partial<
      (typeof mockRoutingsMaster)[0]
    >;
    const createdRouting = {
      ...newRouting,
      routingCode: `RT-${String(mockRoutingsMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdRouting, 201);
  }),

  http.put("/api/master/routings/:routingCode", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as Partial<
      (typeof mockRoutingsMaster)[0]
    >;
    const routingCode = String(params.routingCode);
    const routing = mockRoutingsMaster.find(
      (r) => r.routingCode === routingCode,
    );

    if (!routing) {
      return new Response(
        JSON.stringify({ error: "공정을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }

    const updatedRouting = { ...routing, ...updates };
    return apiSuccess(updatedRouting);
  }),
];
