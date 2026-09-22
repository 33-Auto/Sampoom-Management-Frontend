import { http, HttpResponse } from "msw";

import { apiFail, apiSuccess, sleep } from "@/shared/mocks";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  UserResponse,
  Schemas,
} from "@/shared/model";

import {
  addUser,
  findUser,
  findUserIndex,
  getUserProfile,
  userExists,
} from "./data";

// 쿠키 만료 시간 설정
const ACCESS_TOKEN_MAX_AGE = 60; // 1분 [리프레시 테스트를 위해]
const REFRESH_TOKEN_MAX_AGE = 86400; // 24 시간

export const handlers = [
  // 로그인
  http.post("*/api/auth/login", async ({ request }) => {
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

    return HttpResponse.json(
      {
        status: 200,
        success: true,
        data: responseData,
        message: "Login successful",
      },
      {
        headers: {
          "set-cookie":
            `ACCESS_TOKEN=${Date.now()}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE},` +
            `REFRESH_TOKEN=${Date.now()}; Path=/; Max-Age=${REFRESH_TOKEN_MAX_AGE}`,
        },
        status: 200,
      },
    );
  }),

  // 회원가입 - 두 가지 엔드포인트 지원
  http.post("*/api/user/signup", async ({ request }) => {
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

  http.post("*/api/auth/signup", async ({ request }) => {
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
  http.get("*/api/user/profile", async ({ cookies: cookies }) => {
    await sleep(500);

    // 인증 검증 로직 추가
    // 작동원리 : 현재 MSW에서는 쿠키에 MAX-AGE를 설정되어 있음
    // 브라우저는 이 MAX-AGE를 확인하여 쿠키의 유효기간을 판단
    // MAX-AGE를 넘어서게 되면 브라우저가 알아서 쿠키를 보내지 않음
    // 여기에 굳이 이것을 넣는 이유는 정보의 api 시작점이 여기라서
    const accessToken = cookies.ACCESS_TOKEN;
    if (!accessToken) {
      return apiFail(401, "Unauthorized");
    }

    // MSW는 localStorage에 쿠키를 저장해서
    // 그것을 request의 헤더에 넣어서 하는 방식을 채택
    // 하지만 이것은 Max-Age가 지난 쿠키들까지 보내는 문제점 발생
    // 쿠키의 값에 발행된 시점을 명시했으므로 그것을 이용해서 유효기간을 판단하는 로직 추가
    const accessTokenDate = new Date(Number(accessToken)); // 문자열 타임스탬프를 숫자로 변환
    const expirationTime =
      accessTokenDate.getTime() + ACCESS_TOKEN_MAX_AGE * 1000;
    const now = Date.now();
    if (now > expirationTime) {
      return apiFail(401, "Unauthorized");
    }

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
  http.post("*/api/auth/refresh", async ({ cookies: cookies }) => {
    await sleep(500);

    // 쿠키에서 리프레시 토큰 확인 (실제로는 REFRESH_TOKEN 쿠키에 있을 수 있음)
    // MSW 환경에서는 쿠키를 직접 확인할 수 있지만, 간단하게 항상 성공으로 처리
    const refreshToken = cookies.REFRESH_TOKEN || cookies.refreshToken;

    // 리프레시 토큰이 없거나 무효한 경우 401 반환 (로그아웃 처리)
    // 테스트 목적으로 실패 케이스를 시뮬레이션하려면 아래 주석을 해제
    const shouldFail = false; // 환경 변수나 설정으로 제어 가능
    if (!refreshToken || shouldFail) {
      return apiFail(401, "Invalid or expired refresh token");
    }

    // 새로운 토큰 발급 (실제로는 JWT 생성이지만 MSW에서는 더미 토큰 반환)

    const newAccessToken = Date.now().toString();
    const newRefreshToken = Date.now().toString();
    const refreshResponse: Schemas["RefreshResponse"] = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
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
          "set-cookie":
            `ACCESS_TOKEN=${newAccessToken}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE},` +
            `REFRESH_TOKEN=${newRefreshToken}; Path=/; Max-Age=${REFRESH_TOKEN_MAX_AGE}`,
        },
        status: 200,
      },
    );
  }),

  // 로그아웃
  http.post("*/api/auth/logout", async () => {
    await sleep(300);

    return HttpResponse.json(
      {
        status: 200,
        success: true,
        message: "Logged out successfully",
      },
      {
        // Max-Age=0 을 통해서 쿠키를 삭제
        headers: {
          "set-cookie": `ACCESS_TOKEN=; Path=/; Max-Age=0, REFRESH_TOKEN=; Path=/; Max-Age=0`,
        },
        status: 200,
      },
    );
  }),
];
