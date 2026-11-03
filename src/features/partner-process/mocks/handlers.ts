import { http } from "msw";

import { mockPartnersMaster, type PartnerMaster } from "@/entities/partner";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";
import type { Schemas } from "@/shared/model";

type VendorRequest = Schemas["VendorRequestDTO"];
type VendorUpdateRequest = Schemas["VendorUpdateRequestDTO"];

// 시드 코드 VEND-### 다음 번호로 만든다
const nextVendorCode = () => {
  const maxNumber = mockPartnersMaster.reduce((max, vendor) => {
    const matched = /^VEND-(\d+)$/.exec(vendor.vendorCode);
    return matched ? Math.max(max, Number(matched[1])) : max;
  }, 0);

  return `VEND-${String(maxNumber + 1).padStart(3, "0")}`;
};

// 목록과 같은 배열이라 제자리에서 고쳐야 목록에 바로 보인다
export const handlers = [
  http.post("/api/site/vendors", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as VendorRequest;

    // 폼이 보내는 필드만 검사한다
    if (
      !payload.name ||
      !payload.businessNumber ||
      !payload.ceoName ||
      !payload.address
    ) {
      return apiFail(400, "거래처명, 사업자번호, 대표자명, 주소는 필수입니다.");
    }

    const nextId =
      mockPartnersMaster.reduce((max, vendor) => Math.max(max, vendor.id), 0) +
      1;

    const nextVendor: PartnerMaster = {
      id: nextId,
      vendorCode: nextVendorCode(),
      name: payload.name,
      businessNumber: payload.businessNumber,
      ceoName: payload.ceoName,
      address: payload.address,
      status: payload.status ?? "ACTIVE",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    // 새 항목은 첫 페이지에서 바로 보이게 앞에 넣는다
    mockPartnersMaster.unshift(nextVendor);

    return apiSuccess(nextVendor, 201, "거래처가 생성되었습니다.");
  }),

  http.put("/api/site/vendors/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 거래처 ID가 필요합니다.");
    }

    const payload = (await request.json()) as VendorUpdateRequest;
    const updatedVendor = mockPartnersMaster.find((vendor) => vendor.id === id);

    if (!updatedVendor) {
      return apiFail(404, "거래처 정보를 찾을 수 없습니다.");
    }

    updatedVendor.name = payload.name ?? updatedVendor.name;
    updatedVendor.businessNumber =
      payload.businessNumber ?? updatedVendor.businessNumber;
    updatedVendor.ceoName = payload.ceoName ?? updatedVendor.ceoName;
    updatedVendor.address = payload.address ?? updatedVendor.address;
    updatedVendor.status = payload.status ?? updatedVendor.status;

    return apiSuccess(updatedVendor, 200, "거래처가 수정되었습니다.");
  }),

  http.delete("/api/site/vendors/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 거래처 ID가 필요합니다.");
    }

    const target = mockPartnersMaster.find((vendor) => vendor.id === id);

    if (!target) {
      return apiFail(404, "삭제할 거래처를 찾을 수 없습니다.");
    }

    target.status = "INACTIVE";

    return apiSuccess(null, 200, "거래처가 비활성화되었습니다.");
  }),
];
