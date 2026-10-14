import { http } from "msw";

import { mockItemsMaster } from "@/pages/master/items/mocks/data";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import {
  mockMaterialDetails,
  mockPartDetails,
  type MockMaterialDetail,
  type MockPartDetail,
} from "./data";

let materialDetails = [...mockMaterialDetails];
let partDetails = [...mockPartDetails];

// 품목 목록(mockItemsMaster)의 id로 상세를 열면 상세 mock(801~)과 id가 달라 404가 났다.
// 상세 mock에 없으면 목록 항목으로 상세 응답을 만들어 준다.
const findListItem = (id: number, type: "MATERIAL" | "PART") =>
  mockItemsMaster.find((item) => item.id === id && item.type === type);

const materialFromListItem = (id: number): MockMaterialDetail | undefined => {
  const item = findListItem(id, "MATERIAL");
  if (!item) return undefined;
  return {
    materialId: id,
    name: item.name ?? "",
    materialCategoryId: item.categoryId ?? 0,
    materialUnit: item.unit ?? "",
    baseQuantity: item.baseQuantity ?? 0,
    standardQuantity: item.standardQuantity ?? item.baseQuantity ?? 0,
    leadTime: item.leadTime ?? 0,
    standardCost: item.standardCost ?? 0,
  };
};

const partFromListItem = (id: number): MockPartDetail | undefined => {
  const item = findListItem(id, "PART");
  if (!item) return undefined;
  return {
    partId: id,
    name: item.name ?? "",
    categoryId: item.categoryId ?? 0,
    groupId: item.groupId ?? 0,
    partUnit: item.unit ?? "",
    baseQuantity: item.baseQuantity ?? 0,
    standardQuantity: item.standardQuantity ?? item.baseQuantity ?? 0,
    leadTime: item.leadTime ?? 0,
  };
};

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

    const material =
      materialDetails.find((item) => item.materialId === materialId) ??
      materialFromListItem(materialId);

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

    const part =
      partDetails.find((item) => item.partId === partId) ??
      partFromListItem(partId);

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

    // 목록에서 연 품목이면 상세 mock에 먼저 넣어 두고 수정한다
    const listMaterial = materialDetails.some(
      (m) => m.materialId === materialId,
    )
      ? undefined
      : materialFromListItem(materialId);
    if (listMaterial) materialDetails = [...materialDetails, listMaterial];

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

    const listPart = partDetails.some((p) => p.partId === partId)
      ? undefined
      : partFromListItem(partId);
    if (listPart) partDetails = [...partDetails, listPart];

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
