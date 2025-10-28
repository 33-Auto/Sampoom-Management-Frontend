import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockPartnersMaster } from "./data";

export const partnersMasterHandlers = [
  // 전체 거래처 목록 조회
  http.get("/api/master/partners", async () => {
    await sleep(500);
    return apiSuccess(mockPartnersMaster);
  }),

  // 특정 거래처 조회
  http.get("/api/master/partners/:partnerCode", async ({ params }) => {
    await sleep(300);
    const partnerCode = String(params.partnerCode);
    const partner = mockPartnersMaster.find(
      (p) => p.partnerCode === partnerCode,
    );
    if (!partner) {
      return new Response(
        JSON.stringify({ error: "거래처를 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(partner);
  }),

  // 거래처 등록
  http.post("/api/master/partners", async ({ request }) => {
    await sleep(400);
    const newPartner = (await request.json()) as Partial<
      (typeof mockPartnersMaster)[0]
    >;
    const createdPartner = {
      ...newPartner,
      partnerCode: `PART-${String(mockPartnersMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdPartner, 201);
  }),

  // 거래처 수정
  http.put("/api/master/partners/:partnerCode", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as Partial<
      (typeof mockPartnersMaster)[0]
    >;
    const partnerCode = String(params.partnerCode);
    const partner = mockPartnersMaster.find(
      (p) => p.partnerCode === partnerCode,
    );

    if (!partner) {
      return new Response(
        JSON.stringify({ error: "거래처를 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }

    const updatedPartner = { ...partner, ...updates };
    return apiSuccess(updatedPartner);
  }),

  // 타입별 거래처 조회
  http.get("/api/master/partners/type/:type", async ({ params }) => {
    await sleep(400);
    const filteredPartners = mockPartnersMaster.filter(
      (partner) => partner.partnerType === params.type,
    );
    return apiSuccess(filteredPartners);
  }),
];
