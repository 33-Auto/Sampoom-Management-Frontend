import { useCallback } from "react";import { useNavigate } from "react-router-dom";import { useAuthStore } from "@/entities/user";import { getMyProfile, useLoginMutation } from "../api";import type { LoginFormValues } from "../model/login.types";export function useLoginForm() {
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

      const userData = await getMyProfile();

      if (!userData?.workspace) {
        throw new Error("프로필 정보를 불러오지 못했습니다.");
      }

      loginAction(userData);
      // navigate(`/${profile.workspace.toLowerCase()}/`);
      navigate("/");
    },
    [loginMutation, loginAction, navigate],
  );

  return {
    submitLogin,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
