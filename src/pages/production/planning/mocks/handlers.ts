import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockProductionPlans } from "./data";const filterPlans = (factoryId: number, url: URL) => {
  const statuses = url.searchParams.getAll("statuses");
  const priorities = url.searchParams.getAll("priorities");
  const query = url.searchParams.get("query")?.toLowerCase();
  const categoryId = url.searchParams.get("categoryId");
  const groupId = url.searchParams.get("groupId");

  const parsePositiveNumber = (value: string | null) => {
    if (!value || value.trim() === "") {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  return mockProductionPlans.filter((plan) => {
    if (plan.factoryId !== factoryId) {
      return false;
    }

    const matchesStatus =
      statuses.length === 0 || (plan.status && statuses.includes(plan.status));
    const matchesPriority =
      priorities.length === 0 ||
      (plan.priority && priorities.includes(plan.priority));
    const matchesQuery =
      !query ||
      (plan.orderCode?.toLowerCase().includes(query) ?? false) ||
      (plan.factoryName?.toLowerCase().includes(query) ?? false) ||
      (plan.items?.some(
        (item) =>
          (item.partName?.toLowerCase().includes(query) ?? false) ||
          (item.partCode?.toLowerCase().includes(query) ?? false),
      ) ??
        false);

    const categoryFilter = parsePositiveNumber(categoryId);
    const matchesCategory =
      categoryFilter === undefined ||
      (plan.items?.some(
        (item) => item.partCategory === String(categoryFilter),
      ) ??
        false);

    const groupFilter = parsePositiveNumber(groupId);
    const matchesGroup =
      groupFilter === undefined ||
      (plan.items?.some((item) => item.partGroup === String(groupFilter)) ??
        false);

    return (
      matchesStatus &&
      matchesPriority &&
      matchesQuery &&
      matchesCategory &&
      matchesGroup
    );
  });
};

const extractPlanIds = (body: unknown): number[] => {
  // API 스펙에 따르면 requestBody는 number[] 배열입니다
  if (Array.isArray(body)) {
    return body.map((id) => Number(id)).filter((id) => Number.isFinite(id));
  }
  // fallback: 객체 형태로 전송된 경우 (planIds 속성)
  if (
    body &&
    typeof body === "object" &&
    Array.isArray((body as any).planIds)
  ) {
    return ((body as any).planIds as Array<number | string>)
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));
  }
  return [];
};

export const handlers = [
  http.get(
    "/api/factory/:factoryId/part/orders/production-plans",
    async ({ params, request }) => {
      await sleep(350);
      const factoryId = Number(params.factoryId);
      if (!factoryId || Number.isNaN(factoryId)) {
        return apiFail(400, "factoryId가 필요합니다.");
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") ?? "0");
      const size = Number(url.searchParams.get("size") ?? "10");

      const filtered = filterPlans(factoryId, url);
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
    },
  ),

  http.post(
    "/api/factory/:factoryId/part/orders/mrp/batch",
    async ({ params: _params, request }) => {
      await sleep(600);
      const body = await request.json();
      const planIds = extractPlanIds(body);

      if (planIds.length === 0) {
        return apiFail(400, "선택된 계획이 없습니다.");
      }

      const plans = mockProductionPlans.filter(
        (plan) => plan.orderId && planIds.includes(plan.orderId),
      );

      return apiSuccess(
        plans.length > 0 ? plans : mockProductionPlans.slice(0, 2),
        200,
        "MRP 실행이 완료되었습니다.",
      );
    },
  ),

  http.post(
    "/api/factory/:factoryId/part/orders/apply-mrp/batch",
    async ({ params, request }) => {
      await sleep(600);
      const factoryId = Number(params.factoryId);
      if (!factoryId || Number.isNaN(factoryId)) {
        return apiFail(400, "factoryId가 필요합니다.");
      }

      const body = await request.json();
      const planIds = extractPlanIds(body);

      if (planIds.length === 0) {
        return apiFail(400, "적용할 계획이 없습니다.");
      }

      // API 스펙에 따르면 적용된 계획 목록을 반환합니다
      const appliedPlans = mockProductionPlans.filter(
        (plan) =>
          plan.factoryId === factoryId &&
          plan.orderId &&
          planIds.includes(plan.orderId),
      );

      return apiSuccess(
        appliedPlans.length > 0
          ? appliedPlans
          : mockProductionPlans
              .filter((p) => p.factoryId === factoryId)
              .slice(0, planIds.length),
        200,
        "MRP 결과가 적용되었습니다.",
      );
    },
  ),
];
