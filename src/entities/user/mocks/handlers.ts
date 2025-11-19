import { http, HttpResponse } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  UserResponse,
  Schemas,
} from "@/shared/model/models";

import {
  addUser,
  findUser,
  findUserIndex,
  getUserProfile,
  userExists,
} from "./data";

export const handlers = [
  // 로그인
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest;

    const user = findUser(email, password);

    await sleep(1000);

    if (!user) {
      return apiFail(401, "Invalid credentials");
    }

    const responseData: LoginResponse = {
      userId: findUserIndex(email) + 1,
      userName: user.userName,
      email: user.email,
      workspace: user.workspace!,
      branch: user.branch!,
      position: user.position!,
    };

    // 로그인시에 쿠키를 설정하기 위해 따로 응답을 보내줌
    return HttpResponse.json(
      {
        status: 200,
        success: true,
        data: responseData,
        message: "Login successful",
      },
      {
        headers: {
          "set-cookie": `ACCESS_TOKEN=${Date.now()}, REFRESH_TOKEN=${Date.now()}`,
        },
        status: 200,
      },
    );
  }),

  // 회원가입 - 두 가지 엔드포인트 지원
  http.post("/api/user/signup", async ({ request }) => {
    const newUser = (await request.json()) as SignupRequest;

    await sleep(1000);

    if (userExists(newUser.email)) {
      return apiFail(409, "User already exists");
    }

    addUser(newUser);

    const responseData: SignupResponse = {
      userId: findUserIndex(newUser.email) + 1,
      userName: newUser.userName,
      email: newUser.email,
    };

    return apiSuccess(responseData, 201, "User registered successfully");
  }),

  http.post("/api/auth/signup", async ({ request }) => {
    const newUser = (await request.json()) as SignupRequest;

    await sleep(1000);

    if (userExists(newUser.email)) {
      return apiFail(409, "User already exists");
    }

    addUser(newUser);

    const responseData: SignupResponse = {
      userId: findUserIndex(newUser.email) + 1,
      userName: newUser.userName,
      email: newUser.email,
    };

    return apiSuccess(responseData, 201, "User registered successfully");
  }),

  // 프로필 조회
  http.get("/api/user/profile", async () => {
    await sleep(500);

    // 기본 사용자 프로필 반환 (실제로는 로그인된 사용자 정보를 세션에서 가져와야 함)
    const defaultUser = getUserProfile();

    const responseData: UserResponse = {
      userId: defaultUser.userId,
      userName: defaultUser.userName,
      email: defaultUser.email,
      workspace: defaultUser.workspace,
      branch: defaultUser.branch,
      position: defaultUser.position,
      organizationId: defaultUser.organizationId,
      startedAt: defaultUser.startedAt,
      endedAt: defaultUser.endedAt,
    };

    return apiSuccess(responseData);
  }),

  // 리프레시 토큰 재발급
  http.post("/api/auth/refresh", async ({ cookies: _cookies }) => {
    await sleep(500);

    // 쿠키에서 리프레시 토큰 확인 (실제로는 REFRESH_TOKEN 쿠키에 있을 수 있음)
    // MSW 환경에서는 쿠키를 직접 확인할 수 있지만, 간단하게 항상 성공으로 처리
    // const refreshToken = cookies.REFRESH_TOKEN || cookies.refreshToken;

    // 리프레시 토큰이 없거나 무효한 경우 401 반환 (로그아웃 처리)
    // 테스트 목적으로 실패 케이스를 시뮬레이션하려면 아래 주석을 해제
    // const shouldFail = false; // 환경 변수나 설정으로 제어 가능
    // if (!refreshToken || shouldFail) {
    //   return apiFail(401, "Invalid or expired refresh token");
    // }

    // 새로운 토큰 발급 (실제로는 JWT 생성이지만 MSW에서는 더미 토큰 반환)

    const accessToken = Date.now().toString();
    const refreshToken = Date.now().toString();
    const refreshResponse: Schemas["RefreshResponse"] = {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1시간
    };

    // 쿠키에 새 토큰 설정 (실제 서버와 동일하게)
    // response.headers.set(
    //   "Set-Cookie",
    //   `REFRESH_TOKEN=${refreshResponse.refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`
    // );

    return HttpResponse.json(
      {
        status: 200,
        success: true,
        data: refreshResponse,
        message: "Refresh successful",
      },
      {
        headers: {
          "set-cookie": `ACCESS_TOKEN=${accessToken}, REFRESH_TOKEN=${refreshToken}`,
        },
        status: 200,
      },
    );
  }),

  // 로그아웃
  http.post("/api/auth/logout", async () => {
    await sleep(300);
    return apiSuccess({ success: true }, 200, "Logged out successfully");
  }),
];
