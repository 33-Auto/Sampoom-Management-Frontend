import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockEmployeeRecords, type EmployeeRecord } from "./data";

let employeeRecords = [...mockEmployeeRecords];

export const handlers = [
  http.get("*/api/user/info", async ({ request }) => {
    await sleep(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "0");
    const size = Number(url.searchParams.get("size") ?? "10");
    let workspace = url.searchParams.get("workspace");
    const organizationId = Number(url.searchParams.get("organizationId"));

    // UI에서 사용하는 workspace 값을 API 스펙에 맞게 매핑
    // FACTORY -> PRODUCTION, WAREHOUSE -> INVENTORY
    if (workspace === "FACTORY") {
      workspace = "PRODUCTION";
    } else if (workspace === "WAREHOUSE") {
      workspace = "INVENTORY";
    }

    const filtered = employeeRecords.filter((record) => {
      const matchesWorkspace = !workspace || record.workspace === workspace;
      const matchesOrg =
        Number.isNaN(organizationId) ||
        !organizationId ||
        record.organizationId === organizationId;

      return matchesWorkspace && matchesOrg;
    });

    const start = page * size;
    const end = start + size;
    const pageContent = filtered.slice(start, end);
    const totalElements = filtered.length;
    const totalPages = size > 0 ? Math.ceil(totalElements / size) : 1;

    // API 스펙에 맞는 응답 구조: UserInfoListResponse
    return apiSuccess({
      users: pageContent,
      meta: {
        currentPage: page,
        totalPages,
        totalElements,
        size,
        hasNext: end < totalElements,
        hasPrevious: page > 0,
      },
    });
  }),

  http.patch("*/api/user/profile/:userId", async ({ params, request }) => {
    await sleep(350);
    const userId = Number(params.userId);
    if (!userId || Number.isNaN(userId)) {
      return apiFail(400, "userId가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<EmployeeRecord>;
    let updatedRecord: EmployeeRecord | undefined;

    employeeRecords = employeeRecords.map((record) => {
      if (record.userId !== userId) {
        return record;
      }

      updatedRecord = {
        ...record,
        ...payload,
        userId: record.userId, // userId는 변경 불가
      };

      return updatedRecord;
    });

    if (!updatedRecord) {
      return apiFail(404, "직원 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedRecord, 200, "프로필이 수정되었습니다.");
  }),

  http.patch("*/api/user/status/:userId", async ({ params, request }) => {
    await sleep(300);
    const userId = Number(params.userId);
    if (!userId || Number.isNaN(userId)) {
      return apiFail(400, "userId가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<EmployeeRecord>;
    if (!payload.status) {
      return apiFail(400, "status 값이 필요합니다.");
    }

    let updatedRecord: EmployeeRecord | undefined;
    employeeRecords = employeeRecords.map((record) => {
      if (record.userId !== userId) {
        return record;
      }
      updatedRecord = { ...record, status: payload.status! };
      return updatedRecord;
    });

    if (!updatedRecord) {
      return apiFail(404, "직원 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedRecord, 200, "상태가 변경되었습니다.");
  }),
];
