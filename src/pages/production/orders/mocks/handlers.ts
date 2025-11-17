import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockPartOrders } from "./data";

const parseListParams = (url: URL) => {
  const statuses = url.searchParams.getAll("statuses");
  const priorities = url.searchParams.getAll("priorities");
  const query = url.searchParams.get("query")?.toLowerCase();

  return { statuses, priorities, query };
};

export const handlers = [
  http.get(
    "/api/factory/:factoryId/part/orders",
    async ({ request, params }) => {
      await sleep(400);
      const factoryId = Number(params.factoryId);
      if (!factoryId || Number.isNaN(factoryId)) {
        return apiSuccess(
          {
            content: [],
            page: 0,
            size: 0,
            totalPages: 0,
            totalElements: 0,
          },
          200,
          "factoryId가 필요합니다.",
        );
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") ?? "0");
      const size = Number(url.searchParams.get("size") ?? "10");
      const { statuses, priorities, query } = parseListParams(url);

      const filtered = mockPartOrders.filter((order) => {
        const matchesFactory = order.factoryId === factoryId;
        const matchesStatus =
          statuses.length === 0 || statuses.includes(order.status);
        const matchesPriority =
          priorities.length === 0 || priorities.includes(order.priority);
        const matchesQuery =
          !query ||
          order.orderCode.toLowerCase().includes(query) ||
          order.factoryName.toLowerCase().includes(query) ||
          order.items.some(
            (item) =>
              item.partName.toLowerCase().includes(query) ||
              item.partCode.toLowerCase().includes(query),
          );

        return (
          matchesFactory && matchesStatus && matchesPriority && matchesQuery
        );
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
    },
  ),
];
