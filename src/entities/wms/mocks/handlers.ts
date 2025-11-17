import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockWmsBranches } from "./data";

export const handlers = [
  http.get("/api/site/branches/warehouses", async () => {
    await sleep(320);
    return apiSuccess(mockWmsBranches);
  }),
];
