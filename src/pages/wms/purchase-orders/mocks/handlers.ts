import { http } from "msw";

import {
  mapStatusToOrderStatus,
  mockPurchaseOrders,
  transformToPOResDto,
} from "@/entities/purchase-order";
import { apiSuccess, sleep } from "@/shared/mocks";

const filterOrders = (url: URL) => {
  const keyword = url.searchParams.get("keyword")?.toLowerCase();
  const status = url.searchParams.get("status");
  const categoryId = Number(url.searchParams.get("categoryId"));
  const groupId = Number(url.searchParams.get("groupId"));
  const warehouseId = Number(url.searchParams.get("warehouseId"));

  return mockPurchaseOrders.filter((order) => {
    const matchesWarehouse =
      Number.isNaN(warehouseId) ||
      !warehouseId ||
      order.warehouseId === warehouseId;
    const matchesKeyword =
      !keyword ||
      order.orderNumber.toLowerCase().includes(keyword) ||
      order.partName.toLowerCase().includes(keyword) ||
      order.vendorName.toLowerCase().includes(keyword);
    // 역매핑을 따로 두면 PARTIAL처럼 한쪽에만 있는 값이 빠진다
    // 화면에 보이는 orderStatus로 바꿔 비교하고 모르는 값은 빈 결과가 된다
    const matchesStatus =
      !status || mapStatusToOrderStatus(order.status) === status;
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
  http.get("/api/warehouse/po", async ({ request }) => {
    await sleep(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");

    const filtered = filterOrders(url);
    const start = page * size;
    const end = start + size;
    const pageContent = filtered.slice(start, end);

    // PurchaseOrderListItem을 POResDto로 변환
    const transformedContent = pageContent.map(transformToPOResDto);

    return apiSuccess({
      content: transformedContent,
      page,
      size,
      totalPages: Math.max(1, Math.ceil(filtered.length / size || 1)),
      totalElements: filtered.length,
    });
  }),
];
