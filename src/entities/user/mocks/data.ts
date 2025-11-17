import type { SignupRequest, UserResponse } from "@/shared/model/models";

// 메모리 상에 사용자 데이터 저장
// 각 workspace별 예시 사용자 데이터
export const users: SignupRequest[] = [
  // PRODUCTION - 생산 관리
  {
    email: "production@example.com",
    password: "12341234",
    userName: "생산 관리자",
    workspace: "PRODUCTION",
    branch: "Seoul",
    position: "MANAGER",
  },
  // INVENTORY - 재고 관리
  {
    email: "inventory@example.com",
    password: "12341234",
    userName: "재고 관리자",
    workspace: "INVENTORY",
    branch: "Seoul",
    position: "MANAGER",
  },
  // PURCHASE - 구매 관리
  {
    email: "purchase@example.com",
    password: "12341234",
    userName: "구매 관리자",
    workspace: "PURCHASE",
    branch: "Seoul",
    position: "MANAGER",
  },
  // SALES - 판매 관리
  {
    email: "sales@example.com",
    password: "12341234",
    userName: "판매 관리자",
    workspace: "SALES",
    branch: "Seoul",
    position: "MANAGER",
  },
  // MD - 기준 정보
  {
    email: "md@example.com",
    password: "12341234",
    userName: "기준 정보 관리자",
    workspace: "MD",
    branch: "Seoul",
    position: "MANAGER",
  },
  // HR - 인사 관리
  {
    email: "hr@example.com",
    password: "12341234",
    userName: "인사 관리자",
    workspace: "HR",
    branch: "Seoul",
    position: "MANAGER",
  },
  // AGENCY - 대리점
  {
    email: "agency@example.com",
    password: "12341234",
    userName: "대리점 관리자",
    workspace: "AGENCY",
    branch: "Busan",
    position: "STAFF",
  },
  // 추가 사용자들
  {
    email: "production2@example.com",
    password: "12341234",
    userName: "생산 담당자",
    workspace: "PRODUCTION",
    branch: "Seoul",
    position: "STAFF",
  },
  {
    email: "inventory2@example.com",
    password: "12341234",
    userName: "재고 담당자",
    workspace: "INVENTORY",
    branch: "Incheon",
    position: "STAFF",
  },
  {
    email: "purchase2@example.com",
    password: "12341234",
    userName: "구매 담당자",
    workspace: "PURCHASE",
    branch: "Seoul",
    position: "ASSISTANT_MANAGER",
  },
  {
    email: "sales2@example.com",
    password: "12341234",
    userName: "판매 담당자",
    workspace: "SALES",
    branch: "Busan",
    position: "STAFF",
  },
  {
    email: "md2@example.com",
    password: "12341234",
    userName: "기준 정보 담당자",
    workspace: "MD",
    branch: "Seoul",
    position: "STAFF",
  },
  {
    email: "hr2@example.com",
    password: "12341234",
    userName: "인사 담당자",
    workspace: "HR",
    branch: "Seoul",
    position: "STAFF",
  },
  {
    email: "agency2@example.com",
    password: "12341234",
    userName: "대리점 직원",
    workspace: "AGENCY",
    branch: "Seoul",
    position: "STAFF",
  },
  {
    email: "production3@example.com",
    password: "12341234",
    userName: "생산 부장",
    workspace: "PRODUCTION",
    branch: "Gwangju",
    position: "DEPUTY_GENERAL_MANAGER",
  },
  {
    email: "inventory3@example.com",
    password: "12341234",
    userName: "재고 부장",
    workspace: "INVENTORY",
    branch: "Daegu",
    position: "DEPUTY_GENERAL_MANAGER",
  },
  {
    email: "purchase3@example.com",
    password: "12341234",
    userName: "구매 차장",
    workspace: "PURCHASE",
    branch: "Seoul",
    position: "SENIOR_STAFF",
  },
  {
    email: "sales3@example.com",
    password: "12341234",
    userName: "판매 차장",
    workspace: "SALES",
    branch: "Busan",
    position: "SENIOR_STAFF",
  },
  {
    email: "md3@example.com",
    password: "12341234",
    userName: "기준 정보 차장",
    workspace: "MD",
    branch: "Seoul",
    position: "SENIOR_STAFF",
  },
  {
    email: "hr3@example.com",
    password: "12341234",
    userName: "인사 차장",
    workspace: "HR",
    branch: "Seoul",
    position: "SENIOR_STAFF",
  },
];
export let userIdCounter = users.length;

export function findUser(email?: string, password?: string) {
  return users.find((u) => u.email === email && u.password === password);
}

export function findUserIndex(email?: string) {
  return users.findIndex((u) => u.email === email);
}

export function userExists(email?: string) {
  return users.some((u) => u.email === email);
}

export function addUser(user: SignupRequest) {
  users.push(user);
  userIdCounter++;
}

// 프로필 정보 조회 (실제로는 로그인된 사용자 ID를 기반으로 조회해야 함)
export function getUserProfile(userId?: number): UserResponse {
  const defaultUser = users[0] || users[1] || users[users.length - 1];

  return {
    userId: userId || findUserIndex(defaultUser.email) + 1,
    userName: defaultUser.userName,
    email: defaultUser.email,
    workspace: defaultUser.workspace,
    branch: defaultUser.branch,
    position: defaultUser.position,
    organizationId: 1,
    startedAt: "2024-01-01",
    endedAt: undefined,
  };
}
