import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import {
  mockForecastMonths,
  mockMpsDetails,
  mockMpsPartsByFactory,
  mockMpsPlanResults,
  mockPartOrderResults,
} from "./data";

const buildKey = (...values: (string | number | undefined)[]) =>
  values.filter((value) => value !== undefined).join("-");

export const handlers = [
  http.get("/api/factory/:factoryId/mps/parts", async ({ params }) => {
    await sleep(400);
    const factoryId = Number(params.factoryId);

    if (!factoryId || Number.isNaN(factoryId)) {
      return apiFail(400, "factoryId가 필요합니다.");
    }

    const parts = mockMpsPartsByFactory[factoryId] ?? [];
    return apiSuccess(parts);
  }),

  http.get(
    "/api/factory/:factoryId/mps/parts/:partId/forecast-months",
    async ({ params }) => {
      await sleep(350);
      const factoryId = Number(params.factoryId);
      const partId = Number(params.partId);

      if (
        !factoryId ||
        Number.isNaN(factoryId) ||
        !partId ||
        Number.isNaN(partId)
      ) {
        return apiFail(400, "factoryId와 partId가 필요합니다.");
      }

      const key = buildKey(factoryId, partId);
      const months = mockForecastMonths[key] ?? [];

      if (!months.length) {
        return apiFail(404, "예측 월 정보를 찾을 수 없습니다.");
      }

      return apiSuccess(months);
    },
  ),

  http.get("/api/factory/:factoryId/mps", async ({ request, params }) => {
    await sleep(450);
    const factoryId = Number(params.factoryId);

    if (!factoryId || Number.isNaN(factoryId)) {
      return apiFail(400, "factoryId가 필요합니다.");
    }

    const url = new URL(request.url);
    const warehouseId = Number(url.searchParams.get("warehouseId"));
    const partId = Number(url.searchParams.get("partId"));
    const forecastMonth = url.searchParams.get("forecastMonth") ?? undefined;

    if (!warehouseId || Number.isNaN(warehouseId)) {
      return apiFail(400, "warehouseId가 필요합니다.");
    }

    if (!partId || Number.isNaN(partId)) {
      return apiFail(400, "partId가 필요합니다.");
    }

    if (!forecastMonth) {
      return apiFail(400, "forecastMonth가 필요합니다.");
    }

    const key = buildKey(factoryId, warehouseId);
    const detail = mockMpsDetails[key];

    if (!detail) {
      return apiSuccess(null, 200, "해당 조건의 MPS 데이터가 없습니다.");
    }

    return apiSuccess({
      ...detail,
      partId,
      forecastMonth,
    });
  }),

  http.post(
    "/api/factory/:factoryId/mps/:mpsId/execute",
    async ({ params }) => {
      await sleep(600);
      const factoryId = Number(params.factoryId);
      const mpsId = Number(params.mpsId);

      if (
        !factoryId ||
        Number.isNaN(factoryId) ||
        !mpsId ||
        Number.isNaN(mpsId)
      ) {
        return apiFail(400, "factoryId와 mpsId가 필요합니다.");
      }

      const plans = mockMpsPlanResults[mpsId] ?? [];
      return apiSuccess(plans, 200, "MPS 실행이 완료되었습니다.");
    },
  ),

  http.post(
    "/api/factory/:factoryId/mps/:mpsId/confirm",
    async ({ params }) => {
      await sleep(600);
      const factoryId = Number(params.factoryId);
      const mpsId = Number(params.mpsId);

      if (
        !factoryId ||
        Number.isNaN(factoryId) ||
        !mpsId ||
        Number.isNaN(mpsId)
      ) {
        return apiFail(400, "factoryId와 mpsId가 필요합니다.");
      }

      const orders = mockPartOrderResults[mpsId] ?? [];
      return apiSuccess(orders, 200, "MPS 확정이 완료되었습니다.");
    },
  ),
];
