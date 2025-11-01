import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Input } from "@/shared/ui";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 테스트 계정 확인 (지점 정보 포함)
    const testAccounts = [
      {
        username: "warehouse",
        password: "warehouse123",
        role: "Warehouse Manager",
        branch: "Seoul",
        branchName: "서울 지점",
      },
      {
        username: "factory",
        password: "factory123",
        role: "Factory Manager",
        branch: "Busan",
        branchName: "부산 지점",
      },
      {
        username: "warehouse2",
        password: "warehouse123",
        role: "Warehouse Manager",
        branch: "Incheon",
        branchName: "인천 지점",
      },
      {
        username: "factory2",
        password: "factory123",
        role: "Factory Manager",
        branch: "Daegu",
        branchName: "대구 지점",
      },
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
            branch: account.branch,
            branchName: account.branchName,
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
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex flex-col space-y-1">
                <div className="h-2 w-8 rounded-full bg-main-500"></div>
                <div className="h-2 w-6 rounded-full bg-main-400"></div>
                <div className="h-2 w-10 rounded-full bg-main-600"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-grey-900 dark:text-grey-100">
              품관리
            </h1>
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
              loading={loading}
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
                <strong>창고 관리자 (서울):</strong> warehouse / warehouse123
              </div>
              <div>
                <strong>공장 관리자 (부산):</strong> factory / factory123
              </div>
              <div>
                <strong>창고 관리자 (인천):</strong> warehouse2 / warehouse123
              </div>
              <div>
                <strong>공장 관리자 (대구):</strong> factory2 / factory123
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/signup")}
              className="cursor-pointer text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              계정이 없으신가요? 회원가입
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
