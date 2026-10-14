import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockBomMasterList, mockBomMaterials } from "./data";

export const handlers = [
  // 클라이언트는 /search 없는 경로로 부르므로 두 경로 모두 받는다
  ...["/api/part/boms", "/api/part/boms/search"].map((path) =>
    http.get(path, async ({ request }) => {
      await sleep(500);

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 0;
      const size = Number(url.searchParams.get("size")) || 10;
      const keyword = (url.searchParams.get("keyword") || "").toLowerCase();
      const categoryId = url.searchParams.get("categoryId");
      const groupId = url.searchParams.get("groupId");
      const status = url.searchParams.get("status");
      const complexity = url.searchParams.get("complexity");

      const parsePositiveNumber = (value: string | null) => {
        if (!value || value.trim() === "") {
          return undefined;
        }
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      };

      let filtered = [...mockBomMasterList];

      if (keyword) {
        filtered = filtered.filter((bom) => {
          const bomCode = (bom.bomCode ?? "").toLowerCase();
          const partCode = (bom.partCode ?? "").toLowerCase();
          const partName = (bom.partName ?? "").toLowerCase();

          return (
            bomCode.includes(keyword) ||
            partCode.includes(keyword) ||
            partName.includes(keyword)
          );
        });
      }

      const categoryFilter = parsePositiveNumber(categoryId);
      if (categoryFilter !== undefined) {
        filtered = filtered.filter((bom) => bom.categoryId === categoryFilter);
      }

      const groupFilter = parsePositiveNumber(groupId);
      if (groupFilter !== undefined) {
        filtered = filtered.filter((bom) => bom.groupId === groupFilter);
      }

      if (status) {
        filtered = filtered.filter((bom) => bom.status === status);
      }

      if (complexity) {
        filtered = filtered.filter((bom) => bom.complexity === complexity);
      }

      const start = page * size;
      const end = start + size;
      const content = filtered.slice(start, end);
      const totalElements = filtered.length;
      const totalPages = size > 0 ? Math.ceil(totalElements / size) : 1;

      return apiSuccess({
        content,
        page,
        size,
        totalPages,
        totalElements,
        numberOfElements: content.length,
        first: page === 0,
        last: end >= totalElements,
      });
    }),
  ),

  ...["/api/part/materials", "/api/part/materials/search"].map((path) =>
    http.get(path, async ({ request }) => {
      await sleep(400);

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page")) || 0;
      const size = Number(url.searchParams.get("size")) || 50;
      const keyword = (url.searchParams.get("keyword") || "").toLowerCase();
      const categoryId = url.searchParams.get("categoryId");

      const categoryFilter =
        categoryId && categoryId.trim() !== "" ? Number(categoryId) : undefined;

      let filtered = [...mockBomMaterials];

      if (keyword) {
        filtered = filtered.filter((material) => {
          const code = material.materialCode.toLowerCase();
          const name = material.name.toLowerCase();
          return code.includes(keyword) || name.includes(keyword);
        });
      }

      if (categoryFilter !== undefined && !Number.isNaN(categoryFilter)) {
        filtered = filtered.filter(
          (material) => material.materialCategoryId === categoryFilter,
        );
      }

      const start = page * size;
      const end = start + size;
      const content = filtered.slice(start, end);
      const totalElements = filtered.length;
      const totalPages = size > 0 ? Math.ceil(totalElements / size) : 1;

      return apiSuccess({
        content,
        page,
        size,
        totalPages,
        totalElements,
        numberOfElements: content.length,
        first: page === 0,
        last: end >= totalElements,
      });
    }),
  ),
];
