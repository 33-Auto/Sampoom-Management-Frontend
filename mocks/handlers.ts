import { http, HttpResponse } from "msw";

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/shared/api/models";

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API 성공 응답 헬퍼 코드
function apiSuccess<T>(data: T, status = 200, message = "Success") {
  return HttpResponse.json(
    {
      status,
      success: true,
      code: status,
      message,
      data,
    },
    { status },
  );
}

// API 실패 응답 헬퍼 코드
function apiFail(status = 500, message = "Internal Server Error") {
  return HttpResponse.json(
    {
      status,
      success: false,
      code: status,
      message,
      data: null,
    },
    { status },
  );
}

// 메모리 상에 사용자 데이터 저장
const users: SignupRequest[] = [
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
let userIdCounter = 1;

export const handlers = [
  http.get("http://localhost:3000/api/doclist", async () => {
    const data: DocList = [
      { name: "React", url: "https://react.dev/" },
      { name: "Vite", url: "https://vitejs.dev/" },
      {
        name: "React Router",
        url: "https://reactrouter.com/en/main/start/overview",
      },
      { name: "MSW", url: "https://mswjs.io/" },
      { name: "Tailwind CSS", url: "https://tailwindcss.com/" },
    ];

    await sleep(2000);

    return HttpResponse.json(data);
  }),

  http.post("http://localhost:3000/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    await sleep(1000);

    if (!user) {
      return apiFail(401, "Invalid credentials");
    }

    const responseData: LoginResponse = {
      userId: users.findIndex((u) => u.email === email) + 1,
      userName: user.userName,
      email: user.email,
      workspace: user.workspace!,
      branch: user.branch!,
      position: user.position!,
    };

    return apiSuccess(responseData);
  }),

  http.post("http://localhost:3000/api/user/signup", async ({ request }) => {
    const newUser = (await request.json()) as SignupRequest;

    const userExists = users.some((u) => u.email === newUser.email);

    await sleep(1000);

    if (userExists) {
      return apiFail(409, "User already exists");
    }

    users.push(newUser);

    const responseData: SignupResponse = {
      userId: userIdCounter++,
      userName: newUser.userName,
      email: newUser.email,
    };

    return apiSuccess(responseData, 201, "User registered successfully");
  }),
];
