import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockBranchRecords, type BranchRecord } from "./data";let branchRecords = [...mockBranchRecords];

export const handlers = [
  http.post("/api/site/branches", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as Partial<BranchRecord>;

    if (!payload.name || !payload.type || !payload.address) {
      return apiFail(400, "지점명, 유형, 주소는 필수입니다.");
    }

    const nextId =
      branchRecords.reduce((max, record) => Math.max(max, record.id), 0) + 1;

    const nextRecord: BranchRecord = {
      id: nextId,
      name: payload.name,
      code: payload.code ?? `BR-${nextId.toString().padStart(4, "0")}`,
      type: payload.type,
      address: payload.address,
      status: payload.status ?? "ACTIVE",
    };

    branchRecords = [...branchRecords, nextRecord];

    return apiSuccess(nextRecord, 201, "지점이 생성되었습니다.");
  }),

  http.put("/api/site/branches/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 지점 ID가 필요합니다.");
    }

    const payload = (await request.json()) as Partial<BranchRecord>;
    let updatedRecord: BranchRecord | undefined;

    branchRecords = branchRecords.map((record) => {
      if (record.id !== id) {
        return record;
      }

      updatedRecord = {
        ...record,
        ...payload,
        type: record.type, // type은 수정 불가
        code: record.code,
      };

      return updatedRecord;
    });

    if (!updatedRecord) {
      return apiFail(404, "지점 정보를 찾을 수 없습니다.");
    }

    return apiSuccess(updatedRecord, 200, "지점이 수정되었습니다.");
  }),

  http.delete("/api/site/branches/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 지점 ID가 필요합니다.");
    }

    const target = branchRecords.find((record) => record.id === id);

    if (!target) {
      return apiFail(404, "삭제할 지점을 찾을 수 없습니다.");
    }

    branchRecords = branchRecords.map((record) =>
      record.id === id ? { ...record, status: "INACTIVE" } : record,
    );

    return apiSuccess(null, 200, "지점이 비활성화되었습니다.");
  }),
];
