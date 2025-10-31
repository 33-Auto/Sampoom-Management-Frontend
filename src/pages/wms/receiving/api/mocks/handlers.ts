import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { receivingData } from "./data";

export const handlers = [
  http.get("/api/warehouse/receiving/:warehouseId/group/:groupId", async () => {
    await sleep(500);
    return apiSuccess(receivingData);
  }),
];
