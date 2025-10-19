import { useState } from "react";
import { useNavigate } from "react-router-dom";


import Logo from "@/shared/assets/logo_text_dark.svg";
import { Button, Input, Select } from "@/shared/ui";

import { register } from "../api/register";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    { value: "Warehouse Manager", label: "창고 관리자" },
    { value: "Factory Manager", label: "공장 관리자" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      await register({
        userName: formData.username,
        email: formData.email,
        password: formData.password,
        position: formData.role,
      });

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
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
          <p className="mt-2 text-grey-600 dark:text-grey-300">
            새 계정을 만드세요
          </p>
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
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={roleOptions}
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
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
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
        </div>
      </div>
    </div>
  );
}
