import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useSignupMutation } from "../api";
import type { RegisterFormValues } from "../model/register.types";

export function useRegisterForm() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const submitRegister = useCallback(
    async (formValues: RegisterFormValues) => {
      const { email, password, userName, workspace, branch, position } =
        formValues;

      if (!workspace) {
        throw new Error("조직을 선택해주세요.");
      }

      if (!position) {
        throw new Error("직급을 선택해주세요.");
      }

      await signupMutation.mutateAsync({
        body: {
          email,
          password,
          userName,
          workspace,
          branch,
          position,
        },
      });

      navigate("/login");
    },
    [signupMutation, navigate],
  );

  return {
    submitRegister,
    isLoading: signupMutation.isPending,
    error: signupMutation.error,
  };
}
