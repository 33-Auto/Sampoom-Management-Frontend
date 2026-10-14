import { http } from "msw";

import { mockItemsMaster } from "@/pages/master/items/mocks/data";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockPartCategories, mockPartGroups } from "./data";

export const handlers = [
  // 부품 그룹별 부품 목록 (usePartSearchQuery)
  http.get("/api/part/parts", async ({ request }) => {
    await sleep(300);
    const url = new URL(request.url);
    const groupId = Number(url.searchParams.get("groupId")) || undefined;
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 50;

    const filtered = mockItemsMaster.filter(
      (item) =>
        item.type === "PART" &&
        (groupId === undefined || item.groupId === groupId),
    );
    const content = filtered
      .slice(page * size, page * size + size)
      .map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        categoryId: item.categoryId,
        groupId: item.groupId,
        unit: item.unit,
      }));

    return apiSuccess({
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
    });
  }),

  http.get("/api/part/parts/categories", async () => {
    await sleep(300);
    return apiSuccess(mockPartCategories);
  }),

  http.get(
    "/api/part/parts/categories/:categoryId/groups",
    async ({ params }) => {
      await sleep(300);
      const categoryId = Number(params.categoryId);

      if (
        Number.isNaN(categoryId) ||
        params.categoryId === null ||
        params.categoryId === undefined
      ) {
        return apiFail(400, "유효한 categoryId가 필요합니다.");
      }

      // categoryId가 0인 경우 전체 그룹 반환 (전체 카테고리)
      if (categoryId === 0) {
        return apiSuccess(mockPartGroups);
      }

      const groups = mockPartGroups.filter(
        (group) => group.categoryId === categoryId,
      );

      if (!groups.length) {
        return apiFail(404, "해당 카테고리의 그룹 정보를 찾을 수 없습니다.");
      }

      return apiSuccess(groups);
    },
  ),
];
