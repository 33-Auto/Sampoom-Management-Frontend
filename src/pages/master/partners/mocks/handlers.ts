import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockPartnersMaster } from "./data";

export const handlers = [
  // 거래처 목록 조회 (검색)
  http.get("*/api/site/vendors/search", async ({ request }) => {
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
  http.get("*/api/site/vendors/:vendorId", async ({ params }) => {
    await sleep(300);
    const vendorId = Number(params.vendorId);
    const partner = mockPartnersMaster.find((p) => p.id === vendorId);
    if (!partner) {
      return apiFail(404, "거래처를 찾을 수 없습니다");
    }
    return apiSuccess(partner);
  }),

  // 거래처 등록
  http.post("*/api/site/vendors", async ({ request }) => {
    await sleep(400);
    const newPartner = (await request.json()) as Partial<
      (typeof mockPartnersMaster)[0]
    >;
    const createdPartner = {
      ...newPartner,
      id: mockPartnersMaster.length + 1,
      vendorCode: `VENDOR-${String(mockPartnersMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdPartner, 201);
  }),

  // 거래처 수정
  http.put("*/api/site/vendors/:vendorId", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as Partial<
      (typeof mockPartnersMaster)[0]
    >;
    const vendorId = Number(params.vendorId);
    const partner = mockPartnersMaster.find((p) => p.id === vendorId);

    if (!partner) {
      return apiFail(404, "거래처를 찾을 수 없습니다");
    }

    const updatedPartner = { ...partner, ...updates };
    return apiSuccess(updatedPartner);
  }),
];
