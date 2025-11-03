import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { SignupRequest } from "@/shared/api/models";
import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Card, Input, Select } from "@/shared/ui";

import { useRegister } from "../model/useRegister";

export default function Register() {
  const navigate = useNavigate();
  const { handleRegister, isLoading: loading } = useRegister();

  const workSpaceOptions = [
    { value: "warehouse", label: "창고 관리자" },
    { value: "factory", label: "공장 관리자" },
  ];

  const branchOptions = [
    { value: "seoul", label: "서울 지점" },
    { value: "busan", label: "부산 지점" },
  ];

  const [formData, setFormData] = useState<SignupRequest>({
    email: "",
    password: "",
    workspace: workSpaceOptions[0].value,
    branch: branchOptions[0].value,
    userName: "",
    position: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("Submitting registration with data:", formData);

    handleRegister(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-lg dark:border-grey-600 dark:bg-bg-card-black">
          <div className="mb-8 text-center">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 h-12 w-auto" />
            <p className="mt-2 text-grey-600 dark:text-grey-300">
              ERP 시스템에 로그인하세요
            </p>

            <p className="mt-2 text-grey-600 dark:text-grey-300">
              새 계정을 만드세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="사용자명"
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              placeholder="사용자명을 입력하세요"
              required
            />

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

            <Select
              label="역할"
              value={formData.workspace}
              onChange={(e) =>
                setFormData({ ...formData, workspace: e.target.value })
              }
              options={workSpaceOptions}
              required
            />

            <Select
              label="지점"
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              options={branchOptions}
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

            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={async () => navigate("/login")}
              className="cursor-pointer bg-transparent text-sm font-medium text-main-500 transition-colors duration-200 hover:text-main-600 dark:hover:text-main-400"
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
