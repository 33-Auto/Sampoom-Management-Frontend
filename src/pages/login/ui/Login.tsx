import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Input } from "@/shared/ui";

import { useLogin } from "../model/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-grey-200 bg-bg-card-white p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          <div className="mb-8 text-center">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 h-12 w-auto" />
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              ERP 시스템에 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="이메일을 입력하세요"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="비밀번호를 입력하세요"
              required
            />

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={!formData.email || !formData.password}
            >
              로그인
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/register")}
              className="cursor-pointer bg-transparent text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              계정이 없으신가요? 회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
