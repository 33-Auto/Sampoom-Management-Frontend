import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/entities/user";
import type { UserResponse } from "@/shared/model/models";

import { getMyProfile, useLoginMutation } from "../api";
import type { LoginFormValues, LoginProfile } from "../model/login.types";

const mapProfileToUser = (profile: LoginProfile): UserResponse => ({
  userId: profile.userId,
  userName: profile.userName,
  email: profile.email,
  role: profile.role,
  workspace: profile.workspace,
  branch: profile.branch,
  position: profile.position,
});

export function useLoginForm() {
  const navigate = useNavigate();
  const { login: loginAction } = useAuthStore();
  const loginMutation = useLoginMutation();

  const submitLogin = useCallback(
    async (formValues: LoginFormValues) => {
      const { workspace, email, password } = formValues;

      if (!workspace) {
        throw new Error("조직을 선택해주세요.");
      }

      await loginMutation.mutateAsync({
        body: {
          email,
          password,
          workspace,
        },
      });

      const profile = await getMyProfile(workspace);

      if (!profile?.workspace) {
        throw new Error("프로필 정보를 불러오지 못했습니다.");
      }

      const userData = mapProfileToUser(profile);
      loginAction(userData);
      navigate(`/${profile.workspace.toLowerCase()}/dashboard`);
    },
    [loginMutation, loginAction, navigate],
  );

  return {
    submitLogin,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
