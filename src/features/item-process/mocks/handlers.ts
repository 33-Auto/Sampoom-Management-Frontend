import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import {
  mockMaterialDetails,
  mockPartDetails,
  type MockMaterialDetail,
  type MockPartDetail,
} from "./data";

let materialDetails = [...mockMaterialDetails];
let partDetails = [...mockPartDetails];

export const handlers = [
  http.get("/api/part/materials/:materialId", async ({ params }) => {
    await sleep(300);

    if (!params.materialId || params.materialId === "search") {
      return;
    }

    const materialId = Number(params.materialId);

    if (!materialId || Number.isNaN(materialId)) {
      return apiFail(400, "유효한 materialId가 필요합니다.");
    }

    const material = materialDetails.find(
      (item) => item.materialId === materialId,
    );

    if (!material) {
      return apiFail(404, "원자재 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(material);
  }),

  http.get("/api/part/parts/:partId", async ({ params }) => {
    await sleep(300);
    const partId = Number(params.partId);

    if (!partId || Number.isNaN(partId)) {
      return apiFail(400, "유효한 partId가 필요합니다.");
    }

    const part = partDetails.find((item) => item.partId === partId);

    if (!part) {
      return apiFail(404, "부품 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(part);
  }),

  http.post("/api/part/materials", async ({ request }) => {
    await sleep(500);
    const payload = (await request.json()) as Partial<MockMaterialDetail>;

    if (!payload.name || !payload.materialCategoryId || !payload.materialUnit) {
      return apiFail(400, "이름, 카테고리, 단위는 필수입니다.");
    }

    const nextId =
      materialDetails.reduce(
        (max, material) => Math.max(max, material.materialId),
        0,
      ) + 1;

    const nextMaterial: MockMaterialDetail = {
      materialId: nextId,
      name: payload.name,
      materialCategoryId: payload.materialCategoryId,
      materialUnit: payload.materialUnit,
      baseQuantity: payload.baseQuantity ?? 0,
      standardQuantity: payload.standardQuantity ?? 0,
      leadTime: payload.leadTime ?? 0,
      standardCost: payload.standardCost ?? 0,
    };

    materialDetails = [...materialDetails, nextMaterial];

    return apiSuccess(nextMaterial, 201, "원자재가 생성되었습니다.");
  }),

  http.post("/api/part/parts", async ({ request }) => {
    await sleep(500);
    const payload = (await request.json()) as Partial<MockPartDetail>;

    if (!payload.name || !payload.categoryId || !payload.groupId) {
      return apiFail(400, "이름, 카테고리, 그룹은 필수입니다.");
    }

    const nextId =
      partDetails.reduce((max, part) => Math.max(max, part.partId), 0) + 1;

    const nextPart: MockPartDetail = {
      partId: nextId,
      name: payload.name,
      categoryId: payload.categoryId,
      groupId: payload.groupId,
      partUnit: payload.partUnit ?? "EA",
      baseQuantity: payload.baseQuantity ?? 0,
      standardQuantity: payload.standardQuantity ?? 0,
      leadTime: payload.leadTime ?? 0,
    };

    partDetails = [...partDetails, nextPart];

    return apiSuccess(nextPart, 201, "부품이 생성되었습니다.");
  }),

  http.put("/api/part/materials/:materialId", async ({ params, request }) => {
    await sleep(450);

    if (!params.materialId || params.materialId === "search") {
      return;
    }

    const materialId = Number(params.materialId);

    if (!materialId || Number.isNaN(materialId)) {
      return apiFail(400, "유효한 materialId가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<MockMaterialDetail>;
    let updatedMaterial: MockMaterialDetail | undefined;

    materialDetails = materialDetails.map((material) => {
      if (material.materialId !== materialId) {
        return material;
      }

      updatedMaterial = {
        ...material,
        ...payload,
      };

      return updatedMaterial;
    });

    if (!updatedMaterial) {
      return apiFail(404, "원자재 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedMaterial, 200, "원자재가 수정되었습니다.");
  }),

  http.put("/api/part/parts/:partId", async ({ params, request }) => {
    await sleep(450);
    const partId = Number(params.partId);

    if (!partId || Number.isNaN(partId)) {
      return apiFail(400, "유효한 partId가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<MockPartDetail>;
    let updatedPart: MockPartDetail | undefined;

    partDetails = partDetails.map((part) => {
      if (part.partId !== partId) {
        return part;
      }

      updatedPart = {
        ...part,
        ...payload,
      };

      return updatedPart;
    });

    if (!updatedPart) {
      return apiFail(404, "부품 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedPart, 200, "부품이 수정되었습니다.");
  }),
];
