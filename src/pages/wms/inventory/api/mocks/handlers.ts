import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockInventoryData } from "./data";

export const handlers = [
  http.get("/api/warehouse/:warehouseId/group/:groupId", async () => {
    await sleep(500);
    return apiSuccess(mockInventoryData);
  }),
];

