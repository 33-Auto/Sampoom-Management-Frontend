import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockPartnerVendors, type PartnerVendor } from "./data";let partnerVendors = [...mockPartnerVendors];

export const handlers = [
  http.post("/api/site/vendors", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as Partial<PartnerVendor>;

    if (!payload.name || !payload.contactName) {
      return apiFail(400, "거래처명과 담당자는 필수입니다.");
    }

    const nextId =
      partnerVendors.reduce((max, vendor) => Math.max(max, vendor.id), 0) + 1;

    const nextVendor: PartnerVendor = {
      id: nextId,
      vendorCode:
        payload.vendorCode ?? `VEN-${String(nextId).padStart(3, "0")}`,
      code: payload.code ?? `VEN-${String(nextId).padStart(3, "0")}`,
      name: payload.name,
      businessNumber: payload.businessNumber ?? "",
      ceoName: payload.ceoName ?? "",
      address: payload.address ?? "",
      status: payload.status ?? "ACTIVE",
      contactName: payload.contactName,
      contactEmail: payload.contactEmail ?? "unknown@example.com",
      contactPhone: payload.contactPhone ?? "010-0000-0000",
      branchIds: payload.branchIds ?? [],
    };

    partnerVendors = [...partnerVendors, nextVendor];

    return apiSuccess(nextVendor, 201, "거래처가 생성되었습니다.");
  }),

  http.put("/api/site/vendors/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 거래처 ID가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<PartnerVendor>;
    let updatedVendor: PartnerVendor | undefined;

    partnerVendors = partnerVendors.map((vendor) => {
      if (vendor.id !== id) {
        return vendor;
      }

      updatedVendor = {
        ...vendor,
        ...payload,
      };

      return updatedVendor;
    });

    if (!updatedVendor) {
      return apiFail(404, "거래처 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedVendor, 200, "거래처가 수정되었습니다.");
  }),

  http.delete("/api/site/vendors/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 거래처 ID가 필요합니다.");
    }

    const target = partnerVendors.find((vendor) => vendor.id === id);

    if (!target) {
      return apiFail(404, "삭제할 거래처를 찾을 수 없습니다.");
    }

    partnerVendors = partnerVendors.map((vendor) =>
      vendor.id === id ? { ...vendor, status: "INACTIVE" } : vendor,
    );

    return apiSuccess(null, 200, "거래처가 비활성화되었습니다.");
  }),
];
