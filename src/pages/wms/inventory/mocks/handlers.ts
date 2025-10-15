import { http } from "msw";import { apiSuccess, sleep } from "@/shared/mocks";import { mockWarehouseInventory } from "./data";const toNumber = (value: string | null) => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const filterInventory = (url: URL) => {
  const warehouseId = toNumber(url.searchParams.get("warehouseId"));
  const keyword = url.searchParams.get("keyword")?.toLowerCase();
  const categoryId = toNumber(url.searchParams.get("categoryId"));
  const groupId = toNumber(url.searchParams.get("groupId"));
  const quantityStatus = url.searchParams.get("quantityStatus");

  if (typeof warehouseId !== "number") {
    return [];
  }

  return mockWarehouseInventory.filter((item) => {
    if (item.warehouseId !== warehouseId) {
      return false;
    }

    const matchesKeyword =
      !keyword ||
      item.code?.toLowerCase().includes(keyword) ||
      item.name?.toLowerCase().includes(keyword);

    const matchesCategory =
      categoryId === undefined ||
      categoryId === 0 ||
      item.categoryId === categoryId;

    const matchesGroup =
      groupId === undefined || groupId === 0 || item.groupId === groupId;

    const matchesStatus =
      !quantityStatus ||
      item.status?.toString().toUpperCase() === quantityStatus.toUpperCase();

    return matchesKeyword && matchesCategory && matchesGroup && matchesStatus;
  });
};

export const handlers = [
  http.get("/api/warehouse/", async ({ request }) => {
    await sleep(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");

    const filtered = filterInventory(url);
    const start = page * size;
    const end = start + size;
    const pageContent = filtered
      .slice(start, end)
      .map(
        ({
          warehouseId: _warehouseId,
          categoryId: _categoryId,
          groupId: _groupId,
          ...rest
        }) => rest,
      );

    return apiSuccess({
      content: pageContent,
      page,
      size,
      totalPages: Math.max(1, Math.ceil((filtered.length || 1) / size)),
      totalElements: filtered.length,
    });
  }),
];
