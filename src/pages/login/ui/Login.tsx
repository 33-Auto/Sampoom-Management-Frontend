import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Input } from "@/shared/ui";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);

    // 테스트 계정 확인
    const testAccounts = [
      {
        username: "warehouse",
        password: "warehouse123",
        role: "Warehouse Manager",
      },
      { username: "factory", password: "factory123", role: "Factory Manager" },
    ];

    const account = testAccounts.find(
      (acc) =>
        acc.username === formData.username &&
        acc.password === formData.password,
    );

    setTimeout(() => {
      if (account) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: account.username,
            role: account.role,
          }),
        );

        if (account.role === "Warehouse Manager") {
          navigate("/warehouse");
        } else {
          navigate("/factory");
        }
      } else {
        alert("잘못된 사용자명 또는 비밀번호입니다.");
      }
      // setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      {/* Theme Toggle
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div> */}

      <div className="w-full max-w-md">
        <div className="rounded-lg border border-grey-200 bg-bg-card-white p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 h-12 w-auto" />
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              ERP 시스템에 로그인하세요
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="사용자명"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="사용자명을 입력하세요"
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
              // loading={loading}
              disabled={!formData.username || !formData.password}
            >
              로그인
            </Button>
          </form>

          {/* Test Accounts */}
          <div className="mt-8 rounded-lg border border-grey-200 bg-grey-100 p-4 dark:border-grey-600 dark:bg-grey-700">
            <h3 className="mb-3 text-sm font-medium text-grey-800 dark:text-grey-200">
              테스트 계정
            </h3>
            <div className="space-y-2 text-sm text-grey-700 dark:text-grey-300">
              <div>
                <strong>창고 관리자:</strong> warehouse / warehouse123
              </div>
              <div>
                <strong>공장 관리자:</strong> factory / factory123
              </div>
            </div>
          </div>

          {/* Footer */}
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
