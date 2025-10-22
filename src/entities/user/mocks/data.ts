import type { SignupRequest } from "@/shared/api/models";

// 메모리 상에 사용자 데이터 저장
export const users: SignupRequest[] = [
  {
    email: "test2@naver.com",
    password: "12341234",
    userName: "Test User 2",
    workspace: "Warehouse",
    branch: "Busan",
    position: "Employee",
  },
  {
    email: "test1@naver.com",
    password: "12341234",
    userName: "Test User 1",
    workspace: "Factory",
    branch: "Seoul",
    position: "Manager",
  },
];
export let userIdCounter = 1;

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
