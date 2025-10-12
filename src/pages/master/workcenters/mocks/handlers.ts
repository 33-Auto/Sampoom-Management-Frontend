import { http } from "msw";import { apiFail, apiSuccess, sleep } from "@/shared/mocks";import { mockWorkCentersMaster } from "./data";export const handlers = [
  // 작업장 목록 조회 (검색)
  http.get("/api/part/work-centers", async ({ request }) => {
    await sleep(500);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 0;
    const size = Number(url.searchParams.get("size")) || 10;
    const query = url.searchParams.get("query") || "";
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");

    let filteredWorkCenters = [...mockWorkCentersMaster].map((wc, index) => ({
      id: index + 1,
      code: wc.workCenterCode,
      name: wc.workCenterName,
      type: (wc.type === "내부 설비" || wc.type === "검사 설비"
        ? "INTERNAL"
        : "EXTERNAL") as "INTERNAL" | "EXTERNAL",
      status: (wc.status === "가동" ? "ACTIVE" : "INACTIVE") as
        | "ACTIVE"
        | "INACTIVE",
      dailyOperatingHours: wc.dailyCapacity,
      efficiency: wc.efficiency,
      costPerHour: wc.hourlyRate,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    }));

    // 필터링
    if (query) {
      filteredWorkCenters = filteredWorkCenters.filter(
        (wc) =>
          wc.code?.toLowerCase().includes(query.toLowerCase()) ||
          wc.name?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (type) {
      filteredWorkCenters = filteredWorkCenters.filter(
        (wc) => wc.type === type,
      );
    }

    if (status) {
      filteredWorkCenters = filteredWorkCenters.filter(
        (wc) => wc.status === status,
      );
    }

    // 페이지네이션
    const start = page * size;
    const end = start + size;
    const content = filteredWorkCenters.slice(start, end);

    return apiSuccess({
      content,
      page,
      size,
      totalPages: Math.ceil(filteredWorkCenters.length / size),
      totalElements: filteredWorkCenters.length,
    });
  }),

  // 특정 작업장 조회
  http.get("/api/part/work-centers/:workCenterId", async ({ params }) => {
    await sleep(300);
    const workCenterId = String(params.workCenterId);
    let wcIndex = mockWorkCentersMaster.findIndex(
      (w) => w.workCenterCode === workCenterId,
    );

    // workCenterId가 숫자인 경우 인덱스로 사용
    if (wcIndex === -1 && !Number.isNaN(Number(workCenterId))) {
      wcIndex = Number(workCenterId) - 1;
    }

    if (wcIndex === -1 || wcIndex < 0) {
      return apiFail(404, "작업장을 찾을 수 없습니다");
    }

    const wc = mockWorkCentersMaster[wcIndex];
    const workCenter = {
      id: wcIndex + 1,
      code: wc.workCenterCode,
      name: wc.workCenterName,
      type: (wc.type === "내부 설비" || wc.type === "검사 설비"
        ? "INTERNAL"
        : "EXTERNAL") as "INTERNAL" | "EXTERNAL",
      status: (wc.status === "가동" ? "ACTIVE" : "INACTIVE") as
        | "ACTIVE"
        | "INACTIVE",
      dailyOperatingHours: wc.dailyCapacity,
      efficiency: wc.efficiency,
      costPerHour: wc.hourlyRate,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    return apiSuccess(workCenter);
  }),

  // 작업장 등록
  http.post("/api/part/work-centers", async ({ request }) => {
    await sleep(400);
    const newWorkCenter = (await request.json()) as any;
    const createdWorkCenter = {
      ...newWorkCenter,
      id: mockWorkCentersMaster.length + 1,
      code:
        newWorkCenter.code ||
        `WC-${String(mockWorkCentersMaster.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return apiSuccess(createdWorkCenter, 201);
  }),

  // 작업장 수정
  http.put(
    "/api/part/work-centers/:workCenterId",
    async ({ params, request }) => {
      await sleep(300);
      const updates = (await request.json()) as any;
      const workCenterId = String(params.workCenterId);
      let wcIndex = mockWorkCentersMaster.findIndex(
        (w) => w.workCenterCode === workCenterId,
      );

      // workCenterId가 숫자인 경우 인덱스로 사용
      if (wcIndex === -1 && !Number.isNaN(Number(workCenterId))) {
        wcIndex = Number(workCenterId) - 1;
      }

      if (wcIndex === -1 || wcIndex < 0) {
        return apiFail(404, "작업장을 찾을 수 없습니다");
      }

      const wc = mockWorkCentersMaster[wcIndex];
      const workCenter = {
        id: wcIndex + 1,
        code: wc.workCenterCode,
        name: wc.workCenterName,
        type: (wc.type === "내부 설비" || wc.type === "검사 설비"
          ? "INTERNAL"
          : "EXTERNAL") as "INTERNAL" | "EXTERNAL",
        status: (wc.status === "가동" ? "ACTIVE" : "INACTIVE") as
          | "ACTIVE"
          | "INACTIVE",
        dailyOperatingHours: wc.dailyCapacity,
        efficiency: wc.efficiency,
        costPerHour: wc.hourlyRate,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      };

      const updatedWorkCenter = {
        ...workCenter,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return apiSuccess(updatedWorkCenter);
    },
  ),
];
