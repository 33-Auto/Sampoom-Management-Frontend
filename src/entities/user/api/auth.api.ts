import { fetchClient, queryClient } from "@/shared/api";
import type { SignupRequest } from "@/shared/model/models";

import type {
  ApiResponseUserLoginResponse,
  LoginRequest,
  UserLoginResponse,
} from "../model";

export const useLoginMutation = () =>
  queryClient.useMutation("post", "/api/auth/login");

export const useSignupMutation = () =>
  queryClient.useMutation("post", "/api/auth/signup");

export const getMyProfile = async (
  workspace: LoginRequest["workspace"],
): Promise<UserLoginResponse> => {
  const { data, error } = await fetchClient.GET("/api/user/profile", {
    params: {
      query: {
        workspace,
      },
    },
  });

  if (error) {
    throw error;
  }

  const response = data as ApiResponseUserLoginResponse | undefined;
  if (!response?.success || !response.data) {
    throw new Error(response?.message ?? "프로필 정보를 불러오지 못했습니다.");
  }

  return response.data;
};

export const useProfileQuery = (workspace: LoginRequest["workspace"]) =>
  queryClient.useQuery("get", "/api/user/profile", {
    params: {
      query: {
        workspace,
      },
    },
  });

export const useLogoutMutation = () =>
  queryClient.useMutation("post", "/api/auth/logout");

export const register = async (userInfo: SignupRequest) => {
  const { data, error } = await fetchClient.POST("/api/user/signup" as any, {
    body: userInfo,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const logout = async () => {
  const { data, error } = await fetchClient.POST("/api/auth/logout");

  if (error) {
    throw error;
  }

  return data;
};
