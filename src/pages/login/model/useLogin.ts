import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, useAuthStore } from "@/entities/user";
import type { LoginRequest, LoginResponse } from "@/shared/api/models";

export function useLogin() {
  const navigate = useNavigate();
  const { login: loginAction } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const data = (await login(credentials)).data as LoginResponse;
      console.log("Login response data:", data);

      if (
        data.userName
        //&& data.branch && data.workspace
      ) {
        loginAction(data);
        navigate("/");
      } else {
        throw new Error("로그인 실패 : 잘못된 유저 정보입니다.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      alert(`로그인 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
