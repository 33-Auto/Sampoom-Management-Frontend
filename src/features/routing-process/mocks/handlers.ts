import { http } from "msw";

import { mockItemsMaster } from "@/entities/part";
import {
  mockProcessesMaster,
  type ProcessCreateRequestDTO,
  type ProcessResponseDTO,
  type ProcessStepCreateRequestDTO,
  type ProcessUpdateRequestDTO,
} from "@/entities/routing";
import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

// 시드 코드 RT### 다음 번호로 만든다
const nextRoutingCode = () => {
  const maxNumber = mockProcessesMaster.reduce((max, record) => {
    const matched = /^RT(\d+)$/.exec(record.code ?? "");
    return matched ? Math.max(max, Number(matched[1])) : max;
  }, 0);

  return `RT${String(maxNumber + 1).padStart(3, "0")}`;
};

// 폼은 품목 id만 보내서 목록에 보일 품목 정보를 채운다
const findPartInfo = (partId: number) => {
  const part = mockItemsMaster.find((item) => item.id === partId);

  if (!part) {
    return undefined;
  }

  return {
    partId,
    partName: part.name,
    partCode: part.code,
    categoryId: part.categoryId,
    categoryName: part.categoryName,
    groupId: part.groupId,
    groupName: part.groupName,
  };
};

// 스텝이 바뀌면 시간 합계와 비용도 다시 계산한다
const toStepFields = (steps: ProcessStepCreateRequestDTO[]) => {
  const sumOf = (pick: (step: ProcessStepCreateRequestDTO) => number) =>
    steps.reduce((sum, step) => sum + pick(step), 0);
  const totalSetupMinutes = sumOf((step) => step.setupMinutes);
  const totalProcessMinutes = sumOf((step) => step.processMinutes);
  const totalWaitMinutes = sumOf((step) => step.waitMinutes);

  return {
    stepCount: steps.length,
    totalSetupMinutes,
    totalProcessMinutes,
    totalWaitMinutes,
    totalStepMinutes:
      totalSetupMinutes + totalProcessMinutes + totalWaitMinutes,
    totalProcessCost: totalProcessMinutes * 50000, // 시드와 같은 임시 계산
    steps: steps.map((step) => ({
      ...step,
      totalMinutes: step.setupMinutes + step.processMinutes + step.waitMinutes,
    })),
  };
};

// 목록과 같은 배열이라 제자리에서 고쳐야 목록에 바로 보인다
export const handlers = [
  http.post("/api/part/processes", async ({ request }) => {
    await sleep(400);
    const payload = (await request.json()) as ProcessCreateRequestDTO;

    if (!payload.partId || !payload.version || !payload.steps?.length) {
      return apiFail(400, "품목, 버전, 공정 순서는 필수입니다.");
    }

    const partInfo = findPartInfo(payload.partId);

    if (!partInfo) {
      return apiFail(404, "품목 정보를 찾을 수 없습니다.");
    }

    const nextId =
      mockProcessesMaster.reduce(
        (max, record) => Math.max(max, record.id ?? 0),
        0,
      ) + 1;

    const nextRecord: ProcessResponseDTO = {
      id: nextId,
      code: nextRoutingCode(),
      ...partInfo,
      version: payload.version,
      status: payload.status ?? "ACTIVE",
      quantity: payload.quantity ?? 1,
      ...toStepFields(payload.steps),
    };

    // 새 항목은 첫 페이지에서 바로 보이게 앞에 넣는다
    mockProcessesMaster.unshift(nextRecord);

    return apiSuccess(nextRecord, 201, "라우팅이 생성되었습니다.");
  }),

  http.put("/api/part/processes/:id", async ({ params, request }) => {
    await sleep(350);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 라우팅 ID가 필요합니다.");
    }

    const payload = (await request.json()) as ProcessUpdateRequestDTO;
    const updatedRecord = mockProcessesMaster.find(
      (record) => record.id === id,
    );

    if (!updatedRecord) {
      return apiFail(404, "라우팅 정보를 찾을 수 없습니다.");
    }

    // 품목이 바뀐 경우에만 품목 정보를 다시 채운다
    if (payload.partId && payload.partId !== updatedRecord.partId) {
      const partInfo = findPartInfo(payload.partId);

      if (!partInfo) {
        return apiFail(404, "품목 정보를 찾을 수 없습니다.");
      }

      Object.assign(updatedRecord, partInfo);
    }

    updatedRecord.version = payload.version ?? updatedRecord.version;
    updatedRecord.status = payload.status ?? updatedRecord.status;
    updatedRecord.quantity = payload.quantity ?? updatedRecord.quantity;

    // 스텝은 보낸 목록으로 전량 교체한다
    if (payload.steps?.length) {
      Object.assign(updatedRecord, toStepFields(payload.steps));
    }

    return apiSuccess(updatedRecord, 200, "라우팅이 수정되었습니다.");
  }),

  http.delete("/api/part/processes/:id", async ({ params }) => {
    await sleep(300);
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return apiFail(400, "유효한 라우팅 ID가 필요합니다.");
    }

    const targetIndex = mockProcessesMaster.findIndex(
      (record) => record.id === id,
    );

    if (targetIndex === -1) {
      return apiFail(404, "삭제할 라우팅을 찾을 수 없습니다.");
    }

    mockProcessesMaster.splice(targetIndex, 1);

    return apiSuccess(null, 200, "라우팅이 삭제되었습니다.");
  }),
];
