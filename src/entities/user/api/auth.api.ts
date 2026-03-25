import { fetchClient, api } from "@/shared/api";
import type { SignupRequest, UserResponse } from "@/shared/model";

import type { ApiResponseUserLoginResponse, UserLoginResponse } from "../model";

export const useLoginMutation = () =>
  api.useMutation("post", "/api/auth/login");

export const useSignupMutation = () =>
  api.useMutation("post", "/api/auth/signup");

const mapProfileToUserResponse = (
  profile: UserLoginResponse,
): UserResponse => ({
  userId: profile.userId,
  userName: profile.userName,
  email: profile.email,
  workspace: profile.workspace,
  branch: profile.branch,
  position: profile.position,
  organizationId: profile.organizationId,
  startedAt: profile.startedAt,
  endedAt: profile.endedAt,
});

export const getMyProfile = async (): Promise<UserResponse> => {
  try {
    const { data, error } = await fetchClient.GET("/api/user/profile");

    if (error) {
      throw error;
    }

    const response = data as ApiResponseUserLoginResponse | undefined;
    if (!response?.success || !response.data) {
      throw new Error(
        response?.message ?? "프로필 정보를 불러오지 못했습니다.",
      );
    }

    return mapProfileToUserResponse(response.data);
  } catch (err) {
    console.error("getMyProfile 에러:", err);
    throw err;
  }
};

export const myProfileQueryOptions = () =>
  api.queryOptions("get", "/api/user/profile", {});

export const useMyProfileQuery = () =>
  api.useQuery("get", "/api/user/profile", {});

export const useLogoutMutation = () =>
  api.useMutation("post", "/api/auth/logout");

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
