import { fetchClient } from "@/shared/api";
import type { LoginRequest, SignupRequest } from "@/shared/api/models";

// 로그인 로직 수행
export const login = async (credentials: LoginRequest) => {
  const { data, error } = await fetchClient.POST("/api/auth/login", {
    body: credentials,
  });

  if (error) {
    // 에러의 처리는 상위 레이어에 위임
    throw error;
  }
  return data;
};

// 회원가입 로직 수행
export const register = async (userInfo: SignupRequest) => {
  const { data, error } = await fetchClient.POST("/api/user/signup", {
    body: userInfo,
  });

  if (error) {
    throw error;
  }

  return data;
};

// 로그아웃 로직 수행
export const logout = async () => {
  const { data, error } = await fetchClient.POST("/api/auth/logout");

  if (error) {
    throw error;
  }

  return data;
};
