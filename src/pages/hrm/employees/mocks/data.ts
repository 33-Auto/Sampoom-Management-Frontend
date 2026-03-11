import type { Schemas } from "@/shared/model";

export type EmployeeRecord = Schemas["UserInfoResponse"];

export const mockEmployeeRecords: EmployeeRecord[] = [
  ...Array.from({ length: 800 }).map((_, i) => ({
    userId: 1 + i,
    userName:
      [
        "김민재",
        "이서연",
        "박지훈",
        "최수진",
        "정태영",
        "한미영",
        "강동현",
        "윤서아",
        "송민준",
        "임지은",
      ][i % 10] + (i >= 10 ? Math.floor(i / 10) : ""),
    email: `user${1 + i}@sampoom.com`,
    workspace: [
      "PRODUCTION",
      "INVENTORY",
      "SALES",
      "PURCHASE",
      "HR",
      "MD",
      "AGENCY",
    ][i % 7] as any,
    organizationId: 101 + (i % 5),
    branch: [
      "서울 본사",
      "광주 공장",
      "인천 물류센터",
      "서울 대리점",
      "대구 물류센터",
      "부산 항만 창고",
      "부산 대리점",
      "안산 공장",
    ][i % 8],
    position: [
      "MANAGER",
      "SENIOR_STAFF",
      "ASSISTANT_MANAGER",
      "STAFF",
      "DEPUTY_GENERAL_MANAGER",
    ][i % 5] as any,
    status: ["ACTIVE", "LEAVE", "RETIRED"][
      i % 15 === 0 ? 1 : i % 25 === 0 ? 2 : 0
    ] as any,
  })),
];
