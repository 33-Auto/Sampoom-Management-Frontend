import { http } from "msw";

import { mockBranchesMaster } from "@/entities/branch";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

// 등록·수정·삭제는 features/branch-process가 같은 배열을 고친다
export const handlers = [
  // 지점 목록 조회 (검색)
  http.get("/api/site/branches/search", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const keyword = url.searchParams.get("keyword") || "";
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");

    let filteredBranches = [...mockBranchesMaster];

    // 필터링
    if (keyword) {
      filteredBranches = filteredBranches.filter(
        (branch) =>
          branch.branchCode?.toLowerCase().includes(keyword.toLowerCase()) ||
          branch.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          branch.address?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    if (type) {
      filteredBranches = filteredBranches.filter(
        (branch) => branch.type === type,
      );
    }

    if (status) {
      filteredBranches = filteredBranches.filter(
        (branch) => branch.status === status,
      );
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredBranches.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredBranches.length / size),
      totalElements: filteredBranches.length,
    });
  }),

  // 특정 지점 조회
  http.get("/api/site/branches/:branchId", async ({ params }) => {
    await sleep(300);
    const branchId = Number(params.branchId);
    const branch = mockBranchesMaster.find((b) => b.id === branchId);
    if (!branch) {
      return apiFail(404, "지점을 찾을 수 없습니다");
    }
    return apiSuccess(branch);
  }),
];
