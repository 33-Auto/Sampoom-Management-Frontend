import { http } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";

import { mockDepartmentsMaster } from "./data";

export const handlers = [
  http.get("*/api/master/departments", async () => {
    await sleep(500);
    return apiSuccess(mockDepartmentsMaster);
  }),

  http.get("*/api/master/departments/:deptCode", async ({ params }) => {
    await sleep(300);
    const deptCode = String(params.deptCode);
    const dept = mockDepartmentsMaster.find((d) => d.deptCode === deptCode);
    if (!dept) {
      return apiFail(404, "부서를 찾을 수 없습니다");
    }
    return apiSuccess(dept);
  }),

  http.post("*/api/master/departments", async ({ request }) => {
    await sleep(400);
    const newDept = (await request.json()) as Partial<
      (typeof mockDepartmentsMaster)[0]
    >;
    const createdDept = {
      ...newDept,
      deptCode: `DEPT-${String(mockDepartmentsMaster.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdDept, 201);
  }),

  http.put(
    "*/api/master/departments/:deptCode",
    async ({ params, request }) => {
      await sleep(300);
      const updates = (await request.json()) as Partial<
        (typeof mockDepartmentsMaster)[0]
      >;
      const deptCode = String(params.deptCode);
      const dept = mockDepartmentsMaster.find((d) => d.deptCode === deptCode);

      if (!dept) {
        return apiFail(404, "부서를 찾을 수 없습니다");
      }

      const updatedDept = { ...dept, ...updates };
      return apiSuccess(updatedDept);
    },
  ),
];
