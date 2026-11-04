import { http } from "msw";

import { mockWorkCentersMaster } from "@/entities/workcenter";
import { apiSuccess, sleep } from "@/shared/mocks";

// 등록, 수정, 삭제는 features/workcenter-process가 같은 배열을 고친다
export const handlers = [
  // 작업장 목록 조회, 공정 폼의 작업장 선택도 이 목록을 쓴다
  http.get("/api/part/work-centers", async ({ request }) => {
    await sleep(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "0");
    const size = Number(url.searchParams.get("size") || "10");
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const queryParameter = url.searchParams.get("query");

    let filtered = [...mockWorkCentersMaster];

    if (type) {
      filtered = filtered.filter((wc) => wc.type === type);
    }
    if (status) {
      filtered = filtered.filter((wc) => wc.status === status);
    }
    if (queryParameter) {
      const lowerQuery = queryParameter.toLowerCase();
      filtered = filtered.filter(
        (wc) =>
          wc.name.toLowerCase().includes(lowerQuery) ||
          wc.code.toLowerCase().includes(lowerQuery),
      );
    }

    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    return apiSuccess(
      {
        content,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        size,
        number: page,
      },
      200,
      "작업장 목록을 조회했습니다.",
    );
  }),
];
