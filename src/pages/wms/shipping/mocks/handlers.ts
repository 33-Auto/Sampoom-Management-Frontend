import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockShippingOrders, transformToShippingOrderDto } from "./data";

const filterOrders = (url: URL) => {
  const keyword = url.searchParams.get("keyword")?.toLowerCase();
  const status = url.searchParams.get("status");
  const categoryId = Number(url.searchParams.get("categoryId"));
  const groupId = Number(url.searchParams.get("groupId"));
  const warehouseId = Number(url.searchParams.get("warehouseId"));

  return mockShippingOrders.filter((order) => {
    const matchesWarehouse =
      Number.isNaN(warehouseId) ||
      !warehouseId ||
      order.warehouseId === warehouseId;
    const matchesKeyword =
      !keyword ||
      order.orderNumber.toLowerCase().includes(keyword) ||
      order.agencyName.toLowerCase().includes(keyword);
    const matchesStatus = !status || order.status === status;
    const matchesCategory =
      Number.isNaN(categoryId) ||
      !categoryId ||
      order.categoryId === categoryId;
    const matchesGroup =
      Number.isNaN(groupId) || !groupId || order.groupId === groupId;

    return (
      matchesWarehouse &&
      matchesKeyword &&
      matchesStatus &&
      matchesCategory &&
      matchesGroup
    );
  });
};

export const handlers = [
  http.get("*/api/order/outbound", async ({ request }) => {
    await sleep(400);
    const url = new URL(request.url);
    const warehouseId = Number(url.searchParams.get("warehouseId"));

    // warehouseId는 필수 파라미터
    if (Number.isNaN(warehouseId) || !warehouseId) {
      return apiFail(400, "warehouseId는 필수 파라미터입니다.");
    }

    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");

    const filtered = filterOrders(url);
    const start = page * size;
    const end = start + size;
    const pageContent = filtered.slice(start, end);

    // ShippingListItem을 ShippingOrderDto로 변환
    const transformedContent = pageContent.map(transformToShippingOrderDto);

    return apiSuccess({
      content: transformedContent,
      page,
      size,
      totalPages: Math.max(1, Math.ceil(filtered.length / size || 1)),
      totalElements: filtered.length,
    });
  }),
];
