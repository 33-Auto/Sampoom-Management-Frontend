import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockFactoryBranches } from "./data";

export const handlers = [
  http.get("*/api/site/branches/factories", async () => {
    await sleep(350);
    return apiSuccess(mockFactoryBranches);
  }),
];
