import { fetchClient, queryClient } from "@/shared/api";
import type { SignupRequest, UserResponse } from "@/shared/model/models";

import type { ApiResponseUserLoginResponse, UserLoginResponse } from "../model";

export const useLoginMutation = () =>
  queryClient.useMutation("post", "/api/auth/login");

export const useSignupMutation = () =>
  queryClient.useMutation("post", "/api/auth/signup");

const mapProfileToUserResponse = (
  profile: UserLoginResponse,
): UserResponse => ({
  userId: profile.userId,
  userName: profile.userName,
  email: profile.email,
  role: profile.position,
  workspace: profile.workspace,
  branch: profile.branch,
  position: profile.position,
  organizationId: profile.organizationId,
  startedAt: profile.startedAt,
  endedAt: profile.endedAt,
});

export const getMyProfile = async (): Promise<UserResponse> => {
  const { data, error } = await fetchClient.GET("/api/user/profile");

  if (error) {
    throw error;
  }

  const response = data as ApiResponseUserLoginResponse | undefined;
  if (!response?.success || !response.data) {
    throw new Error(response?.message ?? "프로필 정보를 불러오지 못했습니다.");
  }

  return mapProfileToUserResponse(response.data);
};

export const useProfileQuery = () =>
  queryClient.useQuery("get", "/api/user/profile");

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
