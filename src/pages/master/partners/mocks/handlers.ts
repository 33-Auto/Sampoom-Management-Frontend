import { http } from "msw";

import { mockPartnersMaster } from "@/entities/partner";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

// 등록·수정·삭제는 features/partner-process가 같은 배열을 고친다
export const handlers = [
  // 거래처 목록 조회 (검색)
  http.get("/api/site/vendors/search", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const keyword = url.searchParams.get("keyword") || "";
    const status = url.searchParams.get("status");

    let filteredPartners = [...mockPartnersMaster];

    // 필터링
    if (keyword) {
      filteredPartners = filteredPartners.filter(
        (partner) =>
          partner.vendorCode?.toLowerCase().includes(keyword.toLowerCase()) ||
          partner.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          partner.businessNumber
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          partner.ceoName?.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    if (status) {
      filteredPartners = filteredPartners.filter(
        (partner) => partner.status === status,
      );
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredPartners.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredPartners.length / size),
      totalElements: filteredPartners.length,
    });
  }),

  // 특정 거래처 조회
  http.get("/api/site/vendors/:vendorId", async ({ params }) => {
    await sleep(300);
    const vendorId = Number(params.vendorId);
    const partner = mockPartnersMaster.find((p) => p.id === vendorId);
    if (!partner) {
      return apiFail(404, "거래처를 찾을 수 없습니다");
    }
    return apiSuccess(partner);
  }),
];
