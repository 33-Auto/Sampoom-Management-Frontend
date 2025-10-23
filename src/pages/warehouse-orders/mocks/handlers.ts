import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockWarehouseOrders } from "./data";

export const handlers = [
  http.get("/api/order/requested", async ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");

    if (from === "warehouse") {
      await sleep(500);
      return apiSuccess(mockWarehouseOrders);
    }
    return apiSuccess([]);
  }),
];
