import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockRoutingsMaster } from "./data";

// itemCode를 기반으로 기본 품목 정보 생성 (FSD 규칙 준수: 다른 slice 참조 제거)
function getItemInfoByCode(itemCode: string) {
  // routing 데이터에 포함된 정보를 기반으로 기본값 반환
  const routing = mockRoutingsMaster.find((r) => r.itemCode === itemCode);
  if (!routing) {
    return null;
  }

  // 기본 카테고리/그룹 정보 (routing 데이터 기반 추론)
  const categoryMap: Record<
    string,
    {
      categoryId: number;
      categoryName: string;
      groupId: number;
      groupName: string;
    }
  > = {
    MAT001: {
      categoryId: 301,
      categoryName: "철강",
      groupId: 0,
      groupName: "",
    },
    MAT002: {
      categoryId: 301,
      categoryName: "철강",
      groupId: 0,
      groupName: "",
    },
    SEMI001: {
      categoryId: 303,
      categoryName: "플라스틱/고무",
      groupId: 0,
      groupName: "",
    },
    SEMI002: {
      categoryId: 1,
      categoryName: "엔진 부품",
      groupId: 12,
      groupName: "엔진 블록",
    },
    FIN001: {
      categoryId: 1,
      categoryName: "엔진 부품",
      groupId: 11,
      groupName: "연료 공급",
    },
  };

  const categoryInfo = categoryMap[itemCode] || {
    categoryId: 0,
    categoryName: "",
    groupId: 0,
    groupName: "",
  };

  return {
    id: 1000 + mockRoutingsMaster.indexOf(routing),
    categoryId: categoryInfo.categoryId,
    categoryName: categoryInfo.categoryName,
    groupId: categoryInfo.groupId,
    groupName: categoryInfo.groupName,
  };
}

export const handlers = [
  // 공정 목록 조회 (검색)
  http.get("*/api/part/processes", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const query = url.searchParams.get("query") || "";
    const status = url.searchParams.get("status");
    const categoryId = url.searchParams.get("categoryId");
    const groupId = url.searchParams.get("groupId");

    let filteredProcesses = [...mockRoutingsMaster].map((routing, index) => {
      const item = getItemInfoByCode(routing.itemCode);
      return {
        id: index + 1,
        code: routing.routingCode,
        partId: item?.id || index + 1,
        partName: routing.itemName,
        partCode: routing.itemCode,
        version: routing.version,
        status: routing.status === "활성" ? "ACTIVE" : ("INACTIVE" as const),
        quantity: 1,
        stepCount: routing.operationCount,
        categoryId: item?.categoryId,
        categoryName: item?.categoryName,
        groupId: item?.groupId,
        groupName: item?.groupName,
        totalSetupMinutes: routing.operations.reduce(
          (sum, op) => sum + op.setupTime,
          0,
        ),
        totalProcessMinutes: routing.operations.reduce(
          (sum, op) => sum + op.processTime,
          0,
        ),
        totalWaitMinutes: routing.operations.reduce(
          (sum, op) => sum + op.waitTime,
          0,
        ),
        totalStepMinutes: routing.totalLeadTime * 60, // 시간을 분으로 변환
        totalProcessCost: routing.operations.reduce(
          (sum, op) => sum + op.processTime * 50000,
          0,
        ), // 임시 계산
        steps: routing.operations.map((op, stepIndex) => ({
          id: stepIndex + 1,
          stepOrder: op.operationNumber,
          stepName: op.operationName,
          workCenterCode: op.workCenterCode,
          setupMinutes: op.setupTime,
          processMinutes: op.processTime,
          waitMinutes: op.waitTime,
        })),
      };
    });

    // 필터링
    if (query) {
      filteredProcesses = filteredProcesses.filter(
        (process) =>
          process.code?.toLowerCase().includes(query.toLowerCase()) ||
          process.partName?.toLowerCase().includes(query.toLowerCase()) ||
          process.partCode?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (status) {
      filteredProcesses = filteredProcesses.filter(
        (process) => process.status === status,
      );
    }

    // categoryId 필터링
    if (categoryId && categoryId !== "0") {
      const catId = Number(categoryId);
      if (!Number.isNaN(catId)) {
        filteredProcesses = filteredProcesses.filter(
          (process) => process.categoryId === catId,
        );
      }
    }

    // groupId 필터링
    if (groupId && groupId !== "0") {
      const grpId = Number(groupId);
      if (!Number.isNaN(grpId)) {
        filteredProcesses = filteredProcesses.filter(
          (process) => process.groupId === grpId,
        );
      }
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredProcesses.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredProcesses.length / size),
      totalElements: filteredProcesses.length,
    });
  }),

  // 특정 공정 조회
  http.get("*/api/part/processes/:processId", async ({ params }) => {
    await sleep(300);
    const processId = String(params.processId);
    let routingIndex = mockRoutingsMaster.findIndex(
      (r) => r.routingCode === processId,
    );

    // processId가 숫자인 경우 인덱스로 사용
    if (routingIndex === -1 && !Number.isNaN(Number(processId))) {
      routingIndex = Number(processId) - 1;
    }

    if (routingIndex === -1) {
      return apiFail(404, "공정을 찾을 수 없습니다");
    }

    const routing = mockRoutingsMaster[routingIndex];
    const item = getItemInfoByCode(routing.itemCode);
    const process = {
      id: routingIndex + 1,
      code: routing.routingCode,
      partId: item?.id || routingIndex + 1,
      partName: routing.itemName,
      partCode: routing.itemCode,
      version: routing.version,
      status: routing.status === "활성" ? "ACTIVE" : ("INACTIVE" as const),
      quantity: 1,
      stepCount: routing.operationCount,
      categoryId: item?.categoryId,
      categoryName: item?.categoryName,
      groupId: item?.groupId,
      groupName: item?.groupName,
      totalSetupMinutes: routing.operations.reduce(
        (sum, op) => sum + op.setupTime,
        0,
      ),
      totalProcessMinutes: routing.operations.reduce(
        (sum, op) => sum + op.processTime,
        0,
      ),
      totalWaitMinutes: routing.operations.reduce(
        (sum, op) => sum + op.waitTime,
        0,
      ),
      totalStepMinutes: routing.totalLeadTime * 60,
      totalProcessCost: routing.operations.reduce(
        (sum, op) => sum + op.processTime * 50000,
        0,
      ),
      steps: routing.operations.map((op, stepIndex) => ({
        id: stepIndex + 1,
        stepOrder: op.operationNumber,
        stepName: op.operationName,
        workCenterCode: op.workCenterCode,
        setupMinutes: op.setupTime,
        processMinutes: op.processTime,
        waitMinutes: op.waitTime,
      })),
    };

    return apiSuccess(process);
  }),

  // 공정 등록
  http.post("*/api/part/processes", async ({ request }) => {
    await sleep(400);
    const newProcess = (await request.json()) as any;
    const createdProcess = {
      ...newProcess,
      id: mockRoutingsMaster.length + 1,
      code: `PROC-${String(mockRoutingsMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdProcess, 201);
  }),

  // 공정 수정
  http.put("*/api/part/processes/:processId", async ({ params, request }) => {
    await sleep(300);
    const updates = (await request.json()) as any;
    const processId = String(params.processId);
    let routingIndex = mockRoutingsMaster.findIndex(
      (r) => r.routingCode === processId,
    );

    // processId가 숫자인 경우 인덱스로 사용
    if (routingIndex === -1 && !Number.isNaN(Number(processId))) {
      routingIndex = Number(processId) - 1;
    }

    if (routingIndex === -1) {
      return apiFail(404, "공정을 찾을 수 없습니다");
    }

    const routing = mockRoutingsMaster[routingIndex];
    const item = getItemInfoByCode(routing.itemCode);
    const process = {
      id: routingIndex + 1,
      code: routing.routingCode,
      partId: item?.id || routingIndex + 1,
      partName: routing.itemName,
      partCode: routing.itemCode,
      version: routing.version,
      status: routing.status === "활성" ? "ACTIVE" : ("INACTIVE" as const),
      quantity: 1,
      stepCount: routing.operationCount,
      categoryId: item?.categoryId,
      categoryName: item?.categoryName,
      groupId: item?.groupId,
      groupName: item?.groupName,
      totalSetupMinutes: routing.operations.reduce(
        (sum, op) => sum + op.setupTime,
        0,
      ),
      totalProcessMinutes: routing.operations.reduce(
        (sum, op) => sum + op.processTime,
        0,
      ),
      totalWaitMinutes: routing.operations.reduce(
        (sum, op) => sum + op.waitTime,
        0,
      ),
      totalStepMinutes: routing.totalLeadTime * 60,
      totalProcessCost: routing.operations.reduce(
        (sum, op) => sum + op.processTime * 50000,
        0,
      ),
      steps: routing.operations.map((op, stepIndex) => ({
        id: stepIndex + 1,
        stepOrder: op.operationNumber,
        stepName: op.operationName,
        workCenterCode: op.workCenterCode,
        setupMinutes: op.setupTime,
        processMinutes: op.processTime,
        waitMinutes: op.waitTime,
      })),
    };

    const updatedProcess = { ...process, ...updates };
    return apiSuccess(updatedProcess);
  }),
];
