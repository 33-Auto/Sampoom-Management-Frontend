import { http, HttpResponse } from "msw";

import { sleep } from "@/shared/mocks";

import { docListData } from "./data";

export const handlers = [
  http.get("/api/doclist", async () => {
    await sleep(1000);
    return HttpResponse.json(docListData);
  }),
];
