import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockPurchaseRequests } from "./data";

export const handlers = [
  http.get("*/api/purchase/", async ({ request }) => {
    await sleep(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");
    const status = url.searchParams.get("status");
    const urgency = url.searchParams.get("urgency");
    const query = url.searchParams.get("query")?.toLowerCase();

    const filtered = mockPurchaseRequests.filter((requestRecord) => {
      const matchesStatus = !status || requestRecord.status === status;
      const matchesUrgency = !urgency || requestRecord.urgency === urgency;
      const matchesQuery =
        !query ||
        requestRecord.orderCode.toLowerCase().includes(query) ||
        requestRecord.factoryName.toLowerCase().includes(query) ||
        requestRecord.requesterName.toLowerCase().includes(query);

      return matchesStatus && matchesUrgency && matchesQuery;
    });

    const start = page * size;
    const end = start + size;
    const pageContent = filtered.slice(start, end);

    return apiSuccess({
      content: pageContent,
      page,
      size,
      totalPages: Math.max(1, Math.ceil(filtered.length / size || 1)),
      totalElements: filtered.length,
    });
  }),
];
