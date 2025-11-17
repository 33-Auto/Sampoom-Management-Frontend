import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockSalesOrders, mockSalesOrdersDto } from "./data";

// warehouseId로 필터링 (레거시 데이터 사용)
const getOrdersByWarehouse = (warehouseId: number) => {
  const filteredIndices = mockSalesOrders
    .map((order, index) => (order.warehouseId === warehouseId ? index : -1))
    .filter((index) => index !== -1);
  return filteredIndices.map((index) => mockSalesOrdersDto[index]);
};

export const handlers = [
  http.get("/api/order/warehouse/:warehouseId", async ({ params, request }) => {
    await sleep(350);
    const warehouseId = Number(params.warehouseId);
    if (!warehouseId || Number.isNaN(warehouseId)) {
      return apiFail(400, "warehouseId가 필요합니다.");
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "20");
    const status = url.searchParams.get("status");
    const query = url.searchParams.get("query")?.toLowerCase();
    const from = url.searchParams.get("from");

    const filtered = getOrdersByWarehouse(warehouseId).filter((order) => {
      const matchesStatus = !status || order.status === status;
      const matchesFrom = !from || order.agencyName === from;
      const matchesQuery =
        !query ||
        (order.orderNumber?.toLowerCase().includes(query) ?? false) ||
        (order.agencyName?.toLowerCase().includes(query) ?? false);

      return matchesStatus && matchesFrom && matchesQuery;
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

  http.get("/api/order/:orderId", async ({ params }) => {
    await sleep(300);

    // "outbound"와 같은 특수 경로는 이 핸들러에서 처리하지 않음
    if (params.orderId === "outbound") {
      return;
    }

    const orderId = Number(params.orderId);
    if (!orderId || Number.isNaN(orderId)) {
      return apiFail(400, "orderId가 필요합니다.");
    }

    const order = mockSalesOrdersDto.find((item) => item.orderId === orderId);
    if (!order) {
      return apiFail(404, "주문 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(order);
  }),

  http.patch("/api/order/cancel/:orderId", async ({ params }) => {
    await sleep(400);
    const orderId = Number(params.orderId);
    if (!orderId || Number.isNaN(orderId)) {
      return apiFail(400, "orderId가 필요합니다.");
    }

    const order = mockSalesOrdersDto.find((item) => item.orderId === orderId);
    if (!order) {
      return apiFail(404, "취소할 주문을 찾을 수 없습니다.");
    }
    if (order.status === "CANCELED") {
      return apiFail(409, "이미 취소된 주문입니다.");
    }

    order.status = "CANCELED";

    return apiSuccess(order, 200, "주문이 취소되었습니다.");
  }),
];
