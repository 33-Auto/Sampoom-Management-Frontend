import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockRopSettings } from "./data";

const filterRecords = (url: URL) => {
  const keyword = url.searchParams.get("keyword")?.toLowerCase();
  const autoOrderStatus = url.searchParams.get("autoOrderStatus");
  const warehouseId = Number(url.searchParams.get("warehouseId"));

  return mockRopSettings.filter((record) => {
    const matchesWarehouse =
      Number.isNaN(warehouseId) ||
      !warehouseId ||
      record.warehouseId === warehouseId;
    const matchesKeyword =
      !keyword ||
      record.partName.toLowerCase().includes(keyword) ||
      record.partCode.toLowerCase().includes(keyword);
    const matchesAutoOrder =
      !autoOrderStatus || record.autoOrderStatus === autoOrderStatus;

    return matchesWarehouse && matchesKeyword && matchesAutoOrder;
  });
};

export const handlers = [
  http.get("*/api/warehouse/rop", async ({ request }) => {
    await sleep(350);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");

    const filtered = filterRecords(url);
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
