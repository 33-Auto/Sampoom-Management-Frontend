import { http } from "msw";

import { mockBranchesMaster, type BranchResponseDTO } from "@/entities/branch";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";
import type { Schemas } from "@/shared/model";

type BranchRequest = Schemas["BranchRequestDTO"];
type BranchUpdateRequest = Schemas["BranchUpdateRequestDTO"];

// 시드 코드 BR-### 다음 번호로 만든다
const nextBranchCode = () => {
  const maxNumber = mockBranchesMaster.reduce((max, record) => {
    const matched = /^BR-(\d+)$/.exec(record.branchCode ?? "");
    return matched ? Math.max(max, Number(matched[1])) : max;
  }, 0);

  return `BR-${String(maxNumber + 1).padStart(3, "0")}`;
};

// 목록과 같은 배열이라 제자리에서 고쳐야 목록에 바로 보인다
export const handlers = [
  http.post("/api/site/branches", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as BranchRequest;

    if (!payload.name || !payload.type || !payload.address) {
      return apiFail(400, "지점명, 유형, 주소는 필수입니다.");
    }

    const nextId =
      mockBranchesMaster.reduce(
        (max, record) => Math.max(max, record.id ?? 0),
        0,
      ) + 1;

    const nextRecord: BranchResponseDTO = {
      id: nextId,
      branchCode: nextBranchCode(),
      name: payload.name,
      type: payload.type,
      address: payload.address,
      status: payload.status ?? "ACTIVE",
    };

    // 새 항목은 첫 페이지에서 바로 보이게 앞에 넣는다
    mockBranchesMaster.unshift(nextRecord);

    return apiSuccess(nextRecord, 201, "지점이 생성되었습니다.");
  }),

  http.put("/api/site/branches/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 지점 ID가 필요합니다.");
    }

    const payload = (await request.json()) as BranchUpdateRequest;
    const updatedRecord = mockBranchesMaster.find((record) => record.id === id);

    if (!updatedRecord) {
      return apiFail(404, "지점 정보를 찾을 수 없습니다.");
    }

    // type과 코드는 수정 불가라 그대로 둔다
    updatedRecord.name = payload.name ?? updatedRecord.name;
    updatedRecord.address = payload.address ?? updatedRecord.address;
    updatedRecord.status = payload.status ?? updatedRecord.status;

    return apiSuccess(updatedRecord, 200, "지점이 수정되었습니다.");
  }),

  http.delete("/api/site/branches/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 지점 ID가 필요합니다.");
    }

    const target = mockBranchesMaster.find((record) => record.id === id);

    if (!target) {
      return apiFail(404, "삭제할 지점을 찾을 수 없습니다.");
    }

    target.status = "INACTIVE";

    return apiSuccess(null, 200, "지점이 비활성화되었습니다.");
  }),
];
