import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "@/entities/user";
import type { SignupRequest } from "@/shared/api/models";

export function useRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (SignupRequest: SignupRequest) => {
    setIsLoading(true);
    try {
      (await register(SignupRequest)) as SignupRequest;
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";
        alert(`회원가입 실패: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
}
