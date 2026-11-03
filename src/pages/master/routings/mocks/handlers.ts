import { http } from "msw";

import { mockProcessesMaster } from "@/entities/routing";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

// 등록·수정·삭제는 features/routing-process가 같은 배열을 고친다
export const handlers = [
  // 공정 목록 조회 (검색)
  http.get("/api/part/processes", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const query = url.searchParams.get("query") || "";
    const status = url.searchParams.get("status");
    const categoryId = url.searchParams.get("categoryId");
    const groupId = url.searchParams.get("groupId");

    let filteredProcesses = [...mockProcessesMaster];

    // 필터링
    if (query) {
      filteredProcesses = filteredProcesses.filter(
        (process) =>
          process.code?.toLowerCase().includes(query.toLowerCase()) ||
          process.partName?.toLowerCase().includes(query.toLowerCase()) ||
          process.partCode?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (status) {
      filteredProcesses = filteredProcesses.filter(
        (process) => process.status === status,
      );
    }

    // categoryId 필터링
    if (categoryId && categoryId !== "0") {
      const catId = Number(categoryId);
      if (!Number.isNaN(catId)) {
        filteredProcesses = filteredProcesses.filter(
          (process) => process.categoryId === catId,
        );
      }
    }

    // groupId 필터링
    if (groupId && groupId !== "0") {
      const grpId = Number(groupId);
      if (!Number.isNaN(grpId)) {
        filteredProcesses = filteredProcesses.filter(
          (process) => process.groupId === grpId,
        );
      }
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredProcesses.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredProcesses.length / size),
      totalElements: filteredProcesses.length,
    });
  }),

  // 특정 공정 조회
  http.get("/api/part/processes/:processId", async ({ params }) => {
    await sleep(300);
    const processId = String(params.processId);

    // 공정 코드로 찾거나 processId가 숫자인 경우 id로 찾는다
    const process = mockProcessesMaster.find(
      (p) => p.code === processId || p.id === Number(processId),
    );

    if (!process) {
      return apiFail(404, "공정을 찾을 수 없습니다");
    }

    return apiSuccess(process);
  }),
];
