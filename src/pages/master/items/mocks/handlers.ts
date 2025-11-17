import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockItemsMaster } from "./data";

export const handlers = [
  // 품목 검색 (실제로는 /api/part/items/search 사용)
  http.get("/api/part/items/search", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const keyword = url.searchParams.get("keyword") || "";
    const type = url.searchParams.get("type");
    const materialCategoryId = url.searchParams.get("materialCategoryId");
    const partCategoryId = url.searchParams.get("partCategoryId");
    const partGroupId = url.searchParams.get("partGroupId");

    let filteredItems = [...mockItemsMaster];

    // 필터링
    if (keyword) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.code?.toLowerCase().includes(keyword.toLowerCase()) ||
          item.itemCode?.toLowerCase().includes(keyword.toLowerCase()) ||
          item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          item.itemName?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    if (type && type !== "ALL") {
      filteredItems = filteredItems.filter(
        (item) => item.type === type || item.itemType === type,
      );
    }

    // materialCategoryId 필터링 (0이 아닌 경우만)
    if (materialCategoryId && materialCategoryId !== "0") {
      const matCatId = Number(materialCategoryId);
      if (!Number.isNaN(matCatId)) {
        filteredItems = filteredItems.filter(
          (item) => item.categoryId === matCatId,
        );
      }
    }

    // partCategoryId 필터링 (0이 아닌 경우만)
    if (partCategoryId && partCategoryId !== "0") {
      const partCatId = Number(partCategoryId);
      if (!Number.isNaN(partCatId)) {
        filteredItems = filteredItems.filter(
          (item) => item.categoryId === partCatId,
        );
      }
    }

    // partGroupId 필터링 (0이 아닌 경우만)
    if (partGroupId && partGroupId !== "0") {
      const grpId = Number(partGroupId);
      if (!Number.isNaN(grpId)) {
        filteredItems = filteredItems.filter((item) => item.groupId === grpId);
      }
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredItems.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredItems.length / size),
      totalElements: filteredItems.length,
    });
  }),
];
