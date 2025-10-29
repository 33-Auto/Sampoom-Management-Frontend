import { http } from "msw";

import { apiSuccess, sleep } from "@/shared/mocks";

import { mockFactoryEmployees } from "./data";

export const factoryEmployeesHandlers = [
  // 전체 직원 목록 조회
  http.get("/api/factory/employees", async () => {
    await sleep(500);
    return apiSuccess(mockFactoryEmployees);
  }),

  // 특정 직원 조회
  http.get("/api/factory/employees/:employeeId", async ({ params }) => {
    await sleep(300);
    const employeeId = String(params.employeeId);
    const employee = mockFactoryEmployees.find((emp) => emp.id === employeeId);
    if (!employee) {
      return new Response(
        JSON.stringify({ error: "직원을 찾을 수 없습니다" }),
        {
          status: 404,
        },
      );
    }
    return apiSuccess(employee);
  }),

  // 직원 출입 기록 (출근/퇴근)
  http.post(
    "/api/factory/employees/:employeeId/attendance",
    async ({ params, request }) => {
      await sleep(300);
      const body = (await request.json()) as {
        action: string;
        timestamp: string;
      };
      const employeeId = String(params.employeeId);
      const employee = mockFactoryEmployees.find(
        (emp) => emp.id === employeeId,
      );

      if (!employee) {
        return new Response(
          JSON.stringify({ error: "직원을 찾을 수 없습니다" }),
          {
            status: 404,
          },
        );
      }

      // 출입 기록 업데이트
      const updatedEmployee = {
        ...employee,
        checkIn: body.action === "checkIn" ? body.timestamp : employee.checkIn,
        checkOut:
          body.action === "checkOut" ? body.timestamp : employee.checkOut,
      };

      return apiSuccess(updatedEmployee);
    },
  ),

  // 직원 정보 수정
  http.put(
    "/api/factory/employees/:employeeId",
    async ({ params, request }) => {
      await sleep(300);
      const updates = (await request.json()) as Partial<
        (typeof mockFactoryEmployees)[0]
      >;
      const employeeId = String(params.employeeId);
      const employee = mockFactoryEmployees.find(
        (emp) => emp.id === employeeId,
      );

      if (!employee) {
        return new Response(
          JSON.stringify({ error: "직원을 찾을 수 없습니다" }),
          {
            status: 404,
          },
        );
      }

      const updatedEmployee = { ...employee, ...updates };
      return apiSuccess(updatedEmployee);
    },
  ),

  // 직원 등록
  http.post("/api/factory/employees", async ({ request }) => {
    await sleep(400);
    const newEmployee = (await request.json()) as Partial<
      (typeof mockFactoryEmployees)[0]
    >;
    const createdEmployee = {
      ...newEmployee,
      id: `EMP-${String(mockFactoryEmployees.length + 1).padStart(3, "0")}`,
    };
    return apiSuccess(createdEmployee, 201);
  }),

  // 부서별 직원 조회
  http.get(
    "/api/factory/employees/department/:department",
    async ({ params }) => {
      await sleep(400);
      const filteredEmployees = mockFactoryEmployees.filter(
        (emp) => emp.department === params.department,
      );
      return apiSuccess(filteredEmployees);
    },
  ),

  // 근무 상태별 직원 조회
  http.get("/api/factory/employees/status/:status", async ({ params }) => {
    await sleep(400);
    const filteredEmployees = mockFactoryEmployees.filter(
      (emp) => emp.status === params.status,
    );
    return apiSuccess(filteredEmployees);
  }),
];
