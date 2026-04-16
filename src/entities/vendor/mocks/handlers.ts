import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockVendors } from "./data";

export const handlers = [
  http.get("*/api/site/vendors", async () => {
    await sleep(400);
    return apiSuccess(mockVendors);
  }),
];
