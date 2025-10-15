import { http } from "msw";import { apiSuccess, sleep } from "@/shared/mocks";import { mockPurchaseOrders, transformToPOResDto, type PurchaseOrderListItem } from "./data";// API 스키마의 orderStatus를 mock 데이터의 status로 역매핑
const mapOrderStatusToStatus = (
  orderStatus: string | null,
): PurchaseOrderListItem["status"] | null => {
  if (!orderStatus) return null;

  const reverseMap: Record<string, PurchaseOrderListItem["status"]> = {
    UNDER_REVIEW: "REQUESTED",
    PLAN_CONFIRMED: "APPROVED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    DELAYED: "CANCELED",
  };

  return reverseMap[orderStatus] || null;
};

const filterOrders = (url: URL) => {
  const keyword = url.searchParams.get("keyword")?.toLowerCase();
  const status = url.searchParams.get("status");
  const categoryId = Number(url.searchParams.get("categoryId"));
  const groupId = Number(url.searchParams.get("groupId"));
  const warehouseId = Number(url.searchParams.get("warehouseId"));

  // API의 orderStatus를 mock 데이터의 status로 변환
  const mappedStatus = status ? mapOrderStatusToStatus(status) : null;

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
    const matchesStatus = !mappedStatus || order.status === mappedStatus;
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
