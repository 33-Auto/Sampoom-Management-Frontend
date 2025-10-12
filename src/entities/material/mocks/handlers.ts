import { http } from "msw";import { apiSuccess, sleep } from "@/shared/mocks";import { mockMaterialCategories } from "./data";export const handlers = [
  http.get("/api/part/materials/category", async () => {
    await sleep(250);
    return apiSuccess(mockMaterialCategories);
  }),
];
